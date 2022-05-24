import {Component, OnInit} from '@angular/core';

@Component({
    template: `
        <div class="modal-header">
            <h4 class="themeSecond-color">Your account has been suspended</h4>
        </div>
        <div class="modal-body text-center">
            <img width="75" src="../../../../assets/img/gallery/closed.svg" />
            <h6 class="themeSecond-color mt-5">Please update your payment method to activate your account.</h6>
        </div>
    `,
    styles: ['']
})
export class PaymentErrorModalComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
    }
}
