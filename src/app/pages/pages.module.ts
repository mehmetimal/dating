import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from './register/register.component';
import {UiModule} from '../ui/ui.module';
import {PaidComponent} from './price/paid/paid.component';
import {SharedModule} from '../shared/shared.module';
import { CallsComponent } from './user/calls/calls.component';
import {MessagesModule} from './user/messages/messages.module';
import {LottieModule} from 'ngx-lottie';

@NgModule({
    declarations: [
        RegisterComponent,
        CallsComponent,
        PaidComponent
    ],
    providers: [
    ],
    imports: [
        CommonModule,
        SharedModule,
        UiModule,
        MessagesModule,
        LottieModule
    ],
    exports: [],
    entryComponents: []
})
export class PagesModule {
}
