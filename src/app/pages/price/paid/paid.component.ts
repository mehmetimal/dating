import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PaymentService} from '../../../services/payment.service';

@Component({
    selector: 'app-paid',
    templateUrl: './paid.component.html',
    styleUrls: ['./paid.component.scss']
})
export class PaidComponent implements OnInit {
    public params: any;

    constructor(private activatedRoute: ActivatedRoute, private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe((data: any) => {
            this.params = data.params;
        });
    }

}
