import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CometChatService} from '../../../../services/comet-chat.service';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TokenService} from '../../../../services/token.service';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {CallingPermissionService} from '../../../../services/calling-permission.service';
import {CallingPermission} from '../../../../model/calling-permission.model';
import {AnimationOptions} from 'ngx-lottie';

@Component({
    selector: 'app-call-modal',
    templateUrl: './call-modal.component.html',
    styleUrls: ['./call-modal.component.scss']
})
export class CallModalComponent implements OnInit, OnDestroy {
    @Input()
    public bsModalRef: NgbModalRef;

    @Input()
    public callId: any;

    @Input()
    public callerOrCalled: any;

    public incomingCall$: Observable<any>;
    public ongoingCalls$: Observable<any>;
    public outgoingCall$: Observable<any>;
    public callStream$: Observable<any>;

    options: AnimationOptions = {
        path: '/assets/data.json',
    };

    public isLoading = true;

    constructor(private cometChatService: CometChatService,
                private tokenService: TokenService,
                private callingPermissionService: CallingPermissionService,
                private eventManager: JhiEventManager) {
    }

    /*
    * In dieser Komponente werden Voice Talk und Video-Chat bereitgestellt,
    * indem die API des Pakets mit dem Namen "Comet Chat" verwendet wird.
    * */

    ngOnInit() {
        this.init();
        const callId = this.callId;
        if (this.callerOrCalled === 'caller') {
            this.cometChatService.startVoiceCall(callId);
            this.eventManager.subscribe('call-started', (data) => {
                this.isLoading = false;
            });
        } else {
            this.incomingCall$.subscribe(call => {
                if (call) {
                    this.isLoading = false;

                    this.cometChatService.accept(call.sessionId).subscribe();
                }
            });
        }
    }

    init() {
        this.subscribeCallModalChanged();
        this.incomingCall$ = this.cometChatService.getIncomingCalls();
        this.ongoingCalls$ = this.cometChatService.getOngoingCalls();
        this.outgoingCall$ = this.cometChatService.getOutgoingCalls();
        this.callStream$ = this.cometChatService.getCallsStream();
    }

    subscribeCallModalChanged() {
        this.eventManager.subscribe('comet-chat-calling-end', (data: any) => {
            const currentUser = this.tokenService.getPayload();
            const callingPermission = new CallingPermission();

            if (this.cometChatService.currentCall) {
                const senderId = this.cometChatService.currentCall.getSender().getUid();
                const receiverId = this.cometChatService.currentCall.getReceiverId();

                if (currentUser._id === senderId) {
                    callingPermission.user = currentUser._id;
                    callingPermission.friend = receiverId;
                    this.callingPermissionService.changeCallingPermissionStatusOfFriend(callingPermission).subscribe(value => {
                        this.broadCastCallingPermissionChanged();
                    });
                } else if (currentUser._id === receiverId) {
                    callingPermission.user = currentUser._id;
                    callingPermission.friend = senderId;
                    this.callingPermissionService.changeCallingPermissionStatusOfFriend(callingPermission).subscribe(value => {
                        this.broadCastCallingPermissionChanged();
                    });
                }
            } else {
                callingPermission.user = currentUser._id;
                callingPermission.friend = this.callId;
                this.callingPermissionService.changeCallingPermissionStatusOfFriend(callingPermission).subscribe(value => {
                    this.broadCastCallingPermissionChanged();
                });
            }

        });
    }

    broadCastCallingPermissionChanged() {
        this.eventManager.broadcast({
            name: 'calling-permission-check-after-close-modal'
        });
    }

    ngOnDestroy(): void {
    }
}
