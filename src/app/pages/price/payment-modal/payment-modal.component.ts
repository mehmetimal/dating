import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StripeService} from '../../../services/stripe.service';
import {LoadingModalComponent} from '../../register/loading-modal.component';
import {JhiEventManager} from '../../../services/event-manager.service';
import {getValidationConfigFromCardNo} from "../../../util/helper/card.helper";
import {luhnValidator} from "../../../util/validator/luhn-validator";
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'
import {createNumberMask} from "text-mask-addons";

@Component({
    selector: 'app-payment-modal',
    templateUrl: './payment-modal.component.html'
})
export class PaymentModalComponent implements OnInit {

    @Input()
    public selectedPrice: any;
    public form: FormGroup;

    public loadingModalRef: any;

    public mask = [/[01]/, /\d/];
    monthMask = [/0[1-9]/, /1[0-2]/];

    yearMask = createNumberMask({
        prefix: '',
        integerLimit: 2
    });
    cvcMask = createNumberMask({
        prefix: '',
        integerLimit: 3
    });

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder,
                private stripeService: StripeService,
                private modalService: NgbModal,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm() {
        this.form = this.fb.group({
            number: new FormControl('', [
                Validators.required,
                Validators.minLength(12),
                luhnValidator()
            ]),
            exp_month: new FormControl(null, [Validators.minLength(2), Validators.maxLength(2)]),
            exp_year: new FormControl(null, [Validators.required, Validators.minLength(2), , Validators.maxLength(2)]),
            cvc: new FormControl(null, [Validators.required, Validators.maxLength(3), , Validators.minLength(3)]),
            amount: new FormControl(this.selectedPrice.price),
            paymentMemberShip: new FormControl(this.selectedPrice.title.toLowerCase())
        });
    }

    get formValue() {
        return this.form.value;
    }

    payment() {
        this.loadingModal();
        this.stripeService.payment(this.formValue).subscribe((res: any) => {
            this.closeLoadingModal();
            this.modal.dismiss();
            this.eventManager.broadcast({name: 'close-payment-modal'});
        }, (err) => {
            this.closeLoadingModal();
        });
    }

    loadingModal() {
        this.loadingModalRef = this.modalService.open(LoadingModalComponent, {
            centered: true,
            backdropClass: 'loading-modal-backdrop',
            windowClass: 'loading-modal-backdrop',
            backdrop: 'static'
        });
    }

    closeLoadingModal() {
        this.loadingModalRef.close();
    }

    cardMaskFunction(rawValue: string): Array<RegExp> {
        const card = getValidationConfigFromCardNo(rawValue);
        if (card) {
            return card.mask;
        }
        return [/\d/];
    }
}
