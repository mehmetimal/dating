import {Component, OnDestroy, OnInit} from '@angular/core';
import {CometChatService} from '../../../services/comet-chat.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {TokenService} from 'src/app/services/token.service';
import {Observable} from 'rxjs';



@Component({
    selector: 'app-calls',
    templateUrl: './calls.component.html',
    styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit, OnDestroy {
    public incomingCall$: Observable<any> = this.cometChatService.getIncomingCalls();
    public ongoingCalls$: Observable<any> = this.cometChatService.getOngoingCalls();
    public outgoingCall$: Observable<any> = this.cometChatService.getOutgoingCalls();

    constructor(
        private route: ActivatedRoute,
        private cometChatService: CometChatService,
        private tokenService: TokenService,
    ) {

    }

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const callId = params.get('callId');
            const userId = this.tokenService.getPayload()._id;
            if (callId !== userId) {
                this.cometChatService.startVoiceCall(callId);
            }
        });
    }

    ngOnDestroy(): void {

    }

}
