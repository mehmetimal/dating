import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessagesRoutingModule} from './messages-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared/shared.module';
import {VipErrorModalComponent} from './vip-error-modal.component';
import {LottieModule} from 'ngx-lottie';
import {CometChatUI} from '../../../../angular-chat-ui-kit/src/components/CometChatUI/CometChat-Ui/cometchat-ui.module';
import {MessageBlackTabContentComponent} from './message-black-tab-content/message-black-tab-content.component';
import {MessageBlueTabContentComponent} from './message-blue-tab-content/message-blue-tab-content.component';
import {MessagePinkTabContentComponent} from './message-pink-tab-content/message-pink-tab-content.component';
import {MessageContentHobbyPiercingComponent} from './message-content-hobby-piercing/message-content-hobby-piercing.component';
import {MessageContentHobbyTattoComponent} from './message-content-hobby-tatto/message-content-hobby-tatto.component';
import {MessageContentHobbyRaucherComponent} from './message-content-hobby-raucher/message-content-hobby-raucher.component';
import {MessageContentHobbyAlkoholComponent} from './message-content-hobby-alkohol/message-content-hobby-alkohol.component';
import {IncomingCallComponent} from './incoming-call/incoming-call.component';
import {OutgoingCallComponent} from './outgoing-call/outgoing-call.component';
import {OngoingCallComponent} from './ongoing-call/ongoing-call.component';
import {CallModalComponent} from './call-modal/call-modal.component';

import {MessagesComponent} from './messages.component';
import {MessageTabButtonsComponent} from './message-tab-buttons/message-tab-buttons.component';
export function playerFactory() {
    return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
@NgModule({
    declarations: [
        MessagesComponent,
        MessageTabButtonsComponent,
        MessageBlackTabContentComponent,
        MessageBlueTabContentComponent,
        MessagePinkTabContentComponent,
        MessageContentHobbyPiercingComponent,
        MessageContentHobbyTattoComponent,
        MessageContentHobbyRaucherComponent,
        MessageContentHobbyAlkoholComponent,
        IncomingCallComponent,
        OutgoingCallComponent,
        OngoingCallComponent,
        CallModalComponent,
        VipErrorModalComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesRoutingModule,
        TranslateModule.forChild({}),
        SharedModule,
        LottieModule.forRoot({player: playerFactory}),
        CometChatUI
    ],
    exports: [
        OutgoingCallComponent,
        IncomingCallComponent,
        OngoingCallComponent
    ],
    entryComponents: [VipErrorModalComponent, CallModalComponent]
})
export class MessagesModule {
}
