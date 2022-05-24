import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {IPayment} from '../../model/payment.model';
import {PaymentPageService} from '../../services/payment-page.service';
import {switchMap} from 'rxjs/operators';
import {PaymentService} from '../../services/payment.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaymentModalComponent} from './payment-modal/payment-modal.component';
import {JhiEventManager} from '../../services/event-manager.service';

@Component({
    selector: 'app-price',
    templateUrl: './price.component.html'
})
export class PriceComponent implements OnInit {
    iframeUrl: any;
    url: any;
    isAuthenticated = false;
    isPremium = false;

    selectedItem: any;
    priceCard: IPayment[] = [];
    pricePage: any;

    public selectedPrice: any;

    constructor(public userService: UserService,
                private paymentPageService: PaymentPageService,
                private paymentService: PaymentService,
                private ngbModal: NgbModal,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.isAuthenticated = this.userService.getToken() ? true : false;
        this.isPremium = this.checkPremium();
        let token = null;
        this.userService.getTokenAndEmailAndClubNumber().subscribe(value => {
            token = value;
            this.initIframe(token);
            this.initPricePage();
        });
        this.eventManager.subscribe('close-payment-modal', () => {
            this.isPremium = true;
        });
    }

    checkPremium() {
        if (this.isAuthenticated) {
            return this.userService.isCurrentUserHasRole('ROLE_PREMIUM') ? true : false;
        } else {
            return false;
        }
    }

    initIframe(token) {
        const url = `https://p49.u-dating.club/shop?token=${token}`;
        this.iframeUrl = url;
    }

    initPricePage() {
        this.paymentPageService.findOne().pipe(
            switchMap((data: any) => {
                if (data && data.body && data.body.length > 0) {
                    const response = data.body[0];
                    this.pricePage = response;
                }
                return this.paymentService.findAll();

            })
        ).subscribe((data) => {
            const result = data.body;
            result.forEach((res) => {
                if (res.column === 1) {
                    this.priceCard[0] = res;
                } else if (res.column === 2) {
                    this.priceCard[1] = res;
                } else if (res.column === 3) {
                    this.priceCard[2] = res;
                } else if (res.column === 4) {
                    this.priceCard[3] = res;
                }
            });
        });
    }

    selectPrice(item) {
        this.selectedPrice = item;
    }

    openPaymentModal() {
        const modalInstance = this.ngbModal.open(PaymentModalComponent);
        modalInstance.componentInstance.selectedPrice = this.selectedPrice;
    }
}
