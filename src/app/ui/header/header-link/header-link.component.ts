import {Component, ElementRef, Inject, Injector, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {UserService} from '../../../services/user.service';
import {NavigationEnd, Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CometChatService} from '../../../services/comet-chat.service';

import * as moment from 'moment';
import {JhiEventManager} from '../../../services/event-manager.service';
import {MessageService} from '../../../services/message.service';
import {TokenService} from '../../../services/token.service';
import {isPlatformBrowser} from '@angular/common';
import {UserRecentTransactionService} from '../../../services/user-recent-transaction.service';
import {IUserRecentTransaction} from '../../../model/user-recent-transaction.model';
import {UserRecentTransactionType} from '../../../model/user-recent-transaction-type.enum';
import {switchMap} from 'rxjs/operators';
import {CallModalComponent} from '../../../pages/user/messages/call-modal/call-modal.component';

@Component({
    selector: 'app-header-link',
    templateUrl: './header-link.component.html',
    styleUrls: ['./header-link.component.scss']
})
export class HeaderLinkComponent implements OnInit {

    @Input() isAuthenticated;

    @ViewChild('toggleButton', {static: true})
    toggleButton: ElementRef;

    public isFavoriteModal;
    public isLastVisitorModal;
    public bsModalRef: NgbModalRef;
    public showUnread = true;
    public show = false;

    public calls: { [key: string]: string }[] = [];

    public isUnreadMessage = false;

    public loggedUser;

    public unansweredCalls: any[] = [];

    public userRecentTransactions: IUserRecentTransaction[] = [];

    public likeImage = UserRecentTransactionType.LIKEIMAGE;
    public calling = UserRecentTransactionType.CALLING;
    public viewProfile = UserRecentTransactionType.VIEWPROFILE;
    public sharedImage = UserRecentTransactionType.SHAREIMAGE;
    public sharedAllImage = UserRecentTransactionType.SHAREALLIMAGE;
    public acceptImageByAdmin = UserRecentTransactionType.ACCEPTIMAGEBYADMIN;
    public rejectImageByAdmin = UserRecentTransactionType.REJECTIMAGEBYADMIN;
    public sendMessage = UserRecentTransactionType.SENDMESSAGE;
    public dateDelete = UserRecentTransactionType.DATEDELETED;
    public missedCall = UserRecentTransactionType.MISSEDCALL;
    socket: Socket;

    constructor(
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: any,
        public userService: UserService,
        public router: Router,
        public eventManager: JhiEventManager,
        private modalService: NgbModal,
        private messageService: MessageService,
        private cometChatService: CometChatService,
        private tokenService: TokenService,
        private userRecentTransactionService: UserRecentTransactionService
    ) {
        router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.updateShowUnread(event.url);

            }
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            this.socketIOSubscription();
            this.subsribeToFeedInfoChanged();
        }
        this.loggedUser = this.tokenService.getPayload();
        this.checkUnReadMessage();
        this.cometChatService.callsStream.subscribe((calls: any) => {
            if (isPlatformBrowser(this.platformId)) {
                console.log('calls =>', calls);
                this.updateCalls(calls);
            }

        });
    }

    toggleMenuButton() {
        if (window.innerWidth <= 991) {
            this.toggleButton.nativeElement.click();
        }
    }

    toggle() {
        this.show ?
            this.show = false :
            this.show = true;
    }

    updateCalls(calls: { [key: string]: any }) {
        const newCalls = [];

        Object.keys(calls).map((key: string) => {
            const single = calls[key];
            if (single.action === 'initiated') {
                document.getElementById('userRecentTransaction').click();
            }

            if (single.action === 'unanswered') {
                if (this.unansweredCalls.indexOf(single) === -1) {
                    const popOverLink = document.getElementById('userRecentTransaction');
                    if (popOverLink) {
                        popOverLink.click();
                    }
                    this.unansweredCalls.push(single);
                    setTimeout(() => {
                        const feedPopover = document.getElementById('userRecentTransaction');
                        if (feedPopover) {
                            feedPopover.click();
                        }
                    }, 100);
                    this.fiveMinuteShowUnansweredText();

                }
            }

            single.started = moment(single.initiatedAt * 1000).format('DD.MM. HH:mm');

            newCalls.push(single);
        });

        this.calls = newCalls.sort((a, b) => {
            if (a.initiatedAt > b.initiatedAtt) {
                return -1;
            }
            if (a.initiatedAt < b.initiatedAt) {
                return 1;
            }
            if (a.initiatedAt === b.initiatedAt) {
                return;
            }
        });
    }

    updateShowUnread(url: string) {
        url === '/messages' ?
            this.showUnread = false :
            this.showUnread = true;
    }

    logout() {
        this.cometChatService.logout().subscribe();
        this.socket.emit('offline');
        this.userService.logout().subscribe();
        this.userService.loginTime(new Date()).subscribe();
        this.router.navigate(['/']);
    }

    open(content) {
        this.modalService.open(content);
    }

    openFavoriteModal(content) {
        this.isFavoriteModal = true;
        this.isLastVisitorModal = false;
        this.bsModalRef = this.modalService.open(content, {centered: true});
    }

    openLastVisitorModal(content) {
        this.isLastVisitorModal = true;
        this.isFavoriteModal = false;
        this.bsModalRef = this.modalService.open(content, {centered: true});
    }

    answer(accept, call) {
        console.log(call);
        if (accept) {
            const ngbModalOptions: NgbModalOptions = {
                backdrop: 'static',
                keyboard: false,
                centered: true,
                size: 'xl'
            };
            this.bsModalRef = this.modalService.open(CallModalComponent, ngbModalOptions);
            this.bsModalRef.componentInstance.callId = call.receiverId;
            this.bsModalRef.componentInstance.callerOrCalled = 'called';
            /*            this.router.navigate(['/calls', id]);
                        this.show = false;*/
        } else {
            this.cometChatService.reject(call.sessionId);
            this.calls = [];
        }

    }

    togglePopover(popover) {
        popover.open();
        this.userRecentTransactionService.findByCurrentUser().subscribe((res: any) => {
            this.userRecentTransactions = res.body.data ? res.body.data : [];

            setTimeout(() => {
                this.userRecentTransactionService.changeAllActiveFalse().subscribe((res2: any) => {
                    this.userRecentTransactions = res2.data ? res2.data : [];
                });
            }, 5000);
        });
    }

    subsribeToFeedInfoChanged() {
        const currentUser = this.tokenService.getPayload();
        if (currentUser && currentUser._id) {
            this.socket.on('feed', (data) => {
                if (data.user && data.user === currentUser._id) {
                    this.userRecentTransactionService.findByCurrentUser().subscribe((res: any) => {
                        this.userRecentTransactions = res.body.data ? res.body.data : [];
                    });
                }
            });
        }
    }

    checkUnReadMessage() {
        this.messageService.findAllUnreadMessageOfCurrentUser().subscribe((data: any) => {
            let control = false;
            const message = data.body;
            if (message && message.response) {
                message.response.forEach(res => {
                    res.messages.forEach(msg => {
                        if ((msg.isRead === false || msg.isRead === 'false') && (msg.senderId !== this.loggedUser._id)) {
                            control = true;
                        }
                    });
                });
                this.isUnreadMessage = control;
            }
        }, error => {
            console.log(error);
        });
        this.eventManager.subscribe('check-un-read-messages', (data: any) => {
            let control = false;
            const message = data.content.body;
            if (message && message.response) {
                message.response.forEach(res => {
                    res.messages.forEach(msg => {
                        if ((msg.isRead === false || msg.isRead === 'false') && (msg.senderId !== this.loggedUser._id)) {
                            control = true;
                        }
                    });
                });
                this.isUnreadMessage = control;
            }
        });
    }

    socketIOSubscription() {
        this.socket.on('refreshPage', (data) => {
            this.messageService.findAllUnreadMessageOfCurrentUser().subscribe((data: any) => {
                let control = false;
                const message = data.body;
                if (message && message.response) {
                    message.response.forEach(res => {
                        res.messages.forEach(msg => {
                            if ((msg.isRead === false || msg.isRead === 'false') && (msg.senderId !== this.loggedUser._id)) {
                                control = true;
                            }
                        });
                    });
                    this.isUnreadMessage = control;
                }
            });
        });
    }

    resetUnAnsweredCalls() {
        this.unansweredCalls = [];
    }

    fiveMinuteShowUnansweredText() {
        setTimeout(() => {
            document.getElementById('userRecentTransaction').click();
        }, 60000 * 1);
    }

    updateUserRecentTransaction(userRecentTransaction: IUserRecentTransaction) {
        this.userRecentTransactionService.update(userRecentTransaction).pipe(
            switchMap(value => {
                return this.userRecentTransactionService.findByCurrentUser();
            })
        ).subscribe((res: any) => {
            this.userRecentTransactions = res.body.data ? res.body.data : [];
        });
    }

    checkActiveRecentTransaction() {
        const arr = this.userRecentTransactions.filter(value => value.active === true);
        const result = arr && arr.length > 0 ? true : false;
        return result;
    }

    goMessagePage(user) {
        this.userService.getUserDetail(user.profileName).subscribe((data: any) => {
            const convertUser = JSON.stringify(data.data);
            this.router.navigateByUrl('/messages', {state: {data: convertUser}});
        });
    }
}
