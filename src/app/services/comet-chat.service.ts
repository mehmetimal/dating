import {Injectable} from '@angular/core';
import {CometChat} from '@cometchat-pro/chat';
import {from, Observable, ReplaySubject, Subject} from 'rxjs';
import {filter, flatMap, map, tap} from 'rxjs/operators';
import {IUser} from '../model/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {JhiEventManager} from './event-manager.service';
import {LocalStorageService} from 'ngx-webstorage';

@Injectable({
    providedIn: 'root'
})
export class CometChatService {

    public initialized: Subject<boolean> = new ReplaySubject<boolean>();

    public incomingCall$: Subject<any> = new ReplaySubject();
    public outgoingCall$: Subject<any> = new ReplaySubject();
    public ongoingCall$: Subject<any> = new ReplaySubject();

    public signedIn: string;

    public callActive: Subject<boolean> = new ReplaySubject();
    public callsStream: Subject<{ [key: string]: any }> = new ReplaySubject();
    public calls: { [key: string]: any } = {};
    public currentCall: CometChat.Call;
    public loggedIn: Subject<boolean> = new ReplaySubject<boolean>();

    constructor(private http: HttpClient,
                private tokenService: TokenService,
                private localStorage: LocalStorageService,
                private eventManager: JhiEventManager) {
        this.initCometChat();
    }

    public initCometChat() {
        const appSettingsBuilder = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion('eu').build();
        CometChat.init(environment.appId, appSettingsBuilder).then(value => {
            if (value) {
                console.log('CometChatInitialized', value);
                this.initialized.next(true);
                this.listenOngoingCall();
            }
        }, error => {
            this.initialized.next(false);
        });
    }

    public listenOngoingCall() {
        this.ongoingCall$.pipe(filter(call => !!call)).subscribe(call => {
            this.eventManager.broadcast({
                name: 'call-started'
            });
            CometChat.startCall(
                call.sessionId,
                document.getElementById('callScreen'),
                // @ts-ignore
                new CometChat.OngoingCallListener({
                    onUserLeft: user => {
                        /* Notification received here if another user left the call. */
                        this.outgoingCall$.next(null);
                        this.callActive.next(false);
                        this.eventManager.broadcast({
                            name: 'comet-chat-calling-end'
                        });
                        /* this method can be use to display message or perform any actions if someone leaving the call */
                    },
                    // tslint:disable-next-line:no-shadowed-variable
                    onCallEnded: (call) => {
                        this.ongoingCall$.next(null);
                        this.callActive.next(false);
                        this.eventManager.broadcast({
                            name: 'comet-chat-calling-end'
                        });
                    }
                })
            );
        });
    }

    public signUp(user: IUser): Observable<any> {
        const headers = new HttpHeaders({
            appid: environment.appId,
            apikey: environment.apiKey
        });

        const formData: FormData = new FormData();
        formData.append('uid', user._id);
        formData.append('name', user.profileName);

        return this.http.post('https://api-eu.cometchat.io/v2.0/users', formData, {headers});
    }

    public login(uid: string): Observable<any> {
        uid = uid;
        // tslint:disable-next-line:variable-name
        const _this = this;
        return this.initialized.pipe(filter(v => v), flatMap(_ => {
            return from(CometChat.login(uid, environment.apiKey)).pipe(tap((data: any) => {
                this.signedIn = uid;
                CometChat.addCallListener(
                    'CALL_LISTENER_ID',
                    // @ts-ignore
                    new CometChat.CallListener({
                        onIncomingCallReceived: call => {
                            this.incomingCall$.next(call);
                            _this.addCall(call);
                        },
                        onOutgoingCallAccepted: call => {
                            this.ongoingCall$.next(call);
                            this.outgoingCall$.next(null);
                            _this.startSession(call.sessionId);
                        },
                        onOutgoingCallRejected: call => {
                            this.outgoingCall$.next(null);
                            this.incomingCall$.next(null);
                            this.eventManager.broadcast({
                                name: 'comet-chat-calling-end'
                            });
                            _this.updateCall(call.sessionId, call.action);
                        },
                        onIncomingCallCancelled: call => {
                            this.incomingCall$.next(null);
                            _this.updateCall(call.sessionId, call.action);
                            this.eventManager.broadcast({
                                name: 'comet-chat-calling-end'
                            });
                        }
                    })
                );
            }));
        }));
    }


    public getSignedIn(): string {
        return this.signedIn;
    }

    public getIncomingCalls(): Observable<any> {
        return this.incomingCall$;
    }

    public getOutgoingCalls(): Observable<any> {
        return this.outgoingCall$;
    }

    public getOngoingCalls(): Observable<any> {
        return this.ongoingCall$;
    }

    public getCallsStream(): Observable<any> {
        return this.callsStream;
    }

    public startVoiceCall(receiverID: string): Observable<any> {
        this.signedIn = this.tokenService.getPayload()._id;
        if (!this.signedIn) {
            throw new Error('Not logged in.');
        }
        const call = new CometChat.Call(receiverID, CometChat.CALL_TYPE.AUDIO, CometChat.RECEIVER_TYPE.USER);
        return from(CometChat.initiateCall(call)).pipe(map(callRes => this.outgoingCall$.next(callRes)));
    }

    public accept(sessionId: string): Observable<any> {
        return from(CometChat.acceptCall(sessionId)).pipe(map(call => {
            this.incomingCall$.next(null);
            this.ongoingCall$.next(call);
            this.updateCall(sessionId, 'accepted');
            this.startSession(sessionId);
        }));
    }

    public reject(sessionId: string): Observable<any> {
        return from(CometChat.rejectCall(sessionId, CometChat.CALL_STATUS.REJECTED)).pipe(map(_ => {
            this.incomingCall$.next(null);
            this.updateCall(sessionId, CometChat.CALL_STATUS.REJECTED);
            this.eventManager.broadcast({
                name: 'comet-chat-calling-end'
            });
        }));
    }

    public logout(): Observable<any> {
        return from(CometChat.logout()).pipe(map(_ => {
            this.incomingCall$.next(null);
            this.ongoingCall$.next(null);
            this.outgoingCall$.next(null);
            CometChat.clearCache();
            CometChat.removeCallListener('CALL_LISTENER_ID');
            this.initCometChat();
        }));
    }

    addCall(call: any) {
        const newCall = this.getCall(call.sessionId);
        if (!newCall) {
            this.calls[call.sessionId] = call;
            this.callsStream.next(this.calls);
        }

    }

    getCall(id: string) {
        return this.calls[id];
    }

    updateCall(id: string, action: string) {

        this.calls[id].action = action;
        this.calls[id].status = action;

        this.callsStream.next(this.calls);
    }

    startSession(callId: string) {
        this.callActive.next(true);
        this.currentCall = this.calls[callId];
    }

}
