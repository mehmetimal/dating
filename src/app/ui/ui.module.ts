import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterFirstStepComponent} from './register-first-step/register-first-step.component';
import {RegisterSecondStepComponent} from './register-second-step/register-second-step.component';
import {RegisterSuccessComponent} from './register-success/register-success.component';
import {RegisterThirdStepComponent} from './register-third-step/register-third-step.component';
import {SuccessfulyComponent} from './successfuly/successfuly.component';
import {YoutubeComponent} from './youtube/youtube.component';
import {SharedModule} from '../shared/shared.module';
import {PaymentErrorModalComponent} from './header/login/payment-error-modal-component';
import {CheckAgbModalComponent} from "./header/login/check-agb-modal.component";

@NgModule({
    declarations: [
        RegisterFirstStepComponent,
        RegisterSecondStepComponent,
        RegisterSuccessComponent,
        RegisterThirdStepComponent,
        PaymentErrorModalComponent,
        SuccessfulyComponent,
        YoutubeComponent,
        CheckAgbModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        RegisterFirstStepComponent,
        RegisterSecondStepComponent,
        RegisterSuccessComponent,
        RegisterThirdStepComponent,
        PaymentErrorModalComponent,
        SuccessfulyComponent,
        YoutubeComponent,
        CheckAgbModalComponent
    ],
    providers: [],
    entryComponents: [PaymentErrorModalComponent, CheckAgbModalComponent]
})
export class UiModule {
}
