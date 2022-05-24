import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PriceComponent} from './price.component';
import {SharedModule} from '../../shared/shared.module';
import {PriceRoutingModule} from './price-routing.module';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import {TextMaskModule} from "angular2-text-mask";

@NgModule({
    declarations: [
        PriceComponent,
        PaymentModalComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        PriceRoutingModule,
        SharedModule,
        TextMaskModule
    ],
    exports: [],
    entryComponents: [PaymentModalComponent]
})
export class PriceModule {
}
