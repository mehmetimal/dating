import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ContactService} from '../../services/contact.service';
import {Subscription} from 'rxjs';
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-kontaktformular',
    templateUrl: './kontaktformular.component.html',
    styleUrls: ['./kontaktformular.component.scss']
})
export class KontaktformularComponent implements OnInit, OnDestroy {

    messageSuccess = false;
    contactForm: FormGroup;
    contactSaveSubs: Subscription;

    public redirectUrl = environment.frontendUrl + '/#/' + 'Datenschutzerklaerung'

    constructor(public contactService: ContactService,
                public fb: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.initializeForm();
    }

    initializeForm() {
        this.contactForm = this.fb.group({
            clubNumber: new FormControl(),
            andre: new FormControl(null, Validators.required),
            vorname: new FormControl(null, Validators.required),
            nachname: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email]),
            phone: new FormControl(),
            betreff: new FormControl(null, Validators.required),
            nachricht: new FormControl(null, Validators.required),
            checkBoxConfirm: new FormControl(false, Validators.requiredTrue),
            recaptchaReactive: new FormControl(null, Validators.required),
            profileName: new FormControl(null)
        });
    }

    saveForm() {
        const data = this.contactForm.value;
        this.contactSaveSubs = this.contactService.contactFormPost(data).subscribe(value => {
            this.messageSuccess = true;
        });
    }

    ngOnDestroy(): void {
        if (this.contactSaveSubs) {
            this.contactSaveSubs.unsubscribe();
        }
    }
}
