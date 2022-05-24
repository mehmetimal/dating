import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IUser, User} from '../../../model/user.model';
import {catchError, map, switchMap} from 'rxjs/operators';
import {UserService} from '../../../services/user.service';
import {TokenService} from '../../../services/token.service';
import {Socket} from 'ngx-socket-io';
import {Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {ClientIpService} from '../../../services/client-ip.service';
import {CometChatService} from '../../../services/comet-chat.service';
import {JhiEventManager} from '../../../services/event-manager.service';
import {AddcellService} from '../../../services/addcell.service';
import * as moment from 'moment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PaymentErrorModalComponent} from './payment-error-modal-component';
import {FooterLinkService} from "../../../services/footer-link.service";
import {CheckAgbModalComponent} from "./check-agb-modal.component";
import {LoadingModalComponent} from "../../../pages/register/loading-modal.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

    @Input() cardBackgroundColor;
    @Input() isAuthenticated;
    public emailPattern = '^[A-Za-z0-9äöüçğÄÖÜßÇĞ._%+-]+@[A-Za-z0-9äöüçğÄÖÜßÇĞ.-]+\\.[a-z]{2,4}$';
    public agbEventSubscriber: Subscription;
    loginForm: FormGroup;
    forgetPasswordForm: FormGroup;
    loginState: string;
    show = false;
    isSuccessForgetPassword = false;

    constructor(
        private eventManager: JhiEventManager,
        public fb: FormBuilder,
        public userService: UserService,
        private tokenService: TokenService,
        private socket: Socket,
        @Inject(PLATFORM_ID) private platformId: any,
        public router: Router,
        private clientIpService: ClientIpService,
        private cometChatService: CometChatService,
        private addcellService: AddcellService,
        private modalService: NgbModal,
        private footerLinkService: FooterLinkService,
    ) {
        this.listenAgbConfirmation();
    }

    ngOnInit() {
        this.initializeLoginForm();
        this.initializeForgetPasswordForm();
    }

    initializeForgetPasswordForm() {
        this.forgetPasswordForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)], this.emailCheckValidator()),
        });
    }

    checkAgVersion() {
        const user: IUser = this.loginForm.value;
        const email = user.email;
        const password = user.password;
        this.footerLinkService.checkCurrentUserAgbVersion(email, password).subscribe(value => {
            const result = value.body && value.body ? value.body : null;
            if (result) {
                const isLoginSuccess = result.isLoginSuccess;
                const isAgb = result.isAgb;
                if(isLoginSuccess && !isAgb) {
                  this.openAgbModal();
                } else if (isLoginSuccess && isAgb) {
                    this.loginState = 'success';
                    this.login(false);
                }
            } else {
                this.loginState = 'error';
                return;
            }
        }, (error) => {
            this.loginState = 'error';
            return;
        });
    }

    loadingModal() {
        const modalRef = this.modalService.open(LoadingModalComponent, {
            centered: true,
            backdropClass: 'loading-modal-backdrop',
            windowClass: 'loading-modal-backdrop',
            backdrop: 'static'
        });
    }

    login(isLoading = false) {
        if (!isLoading) {
            this.loadingModal();
        }
        const user: IUser = this.loginForm.value;

        console.log(user);

        if (user.email === null || user.email === undefined  || !user.email) {
            this.loginState = 'emailError';
            return;
        }

        if (user.password === null  || user.password === undefined  || !user.password) {
            this.loginState = 'passwordError';
            return;
        }

        this.userService.getUserLockInfo(user.email).subscribe((data: any) => {
            if (!data) {
                this.loginState = 'error';
                return;
            }
            const userResponse = data.response;
            let responseResult;
            if (userResponse) {
                const eventStartTime = new Date(userResponse.userLockedTimeDate);
                const userLockedDay = new Date().getDate() - eventStartTime.getDate();
                const isUserLockedUptoTime = userLockedDay < userResponse.userLockedTime ? true : false;
                responseResult = userResponse.isUserLockedTimeless || isUserLockedUptoTime ? 'userLocked' : null;
            }

            if (responseResult && responseResult !== null && responseResult === 'userLocked') {
                this.loginState = 'userLocked';
            } else {
                this.userService.login(user).pipe(
                    switchMap((ipData: any) => {
                        this.loginState = 'success';
                        this.addcellService.removeAddCellScripts();
                        this.addcellService.removeGoogleTagManager();
                        const userSocket = new User();
                        const loginUser = this.tokenService.getPayload();
                        userSocket._id = loginUser._id;
                        userSocket.gender = loginUser.gender;
                        userSocket.searchGender = loginUser.searchGender;
                        userSocket.profileImage = loginUser.profileImage;
                        userSocket.profileName = loginUser.profileName;
                        userSocket.birthday = this.calculateAge(loginUser.birthday);
                        userSocket.clubNumber = loginUser.clubNumber;
                        userSocket.randomNumber = loginUser.randomNumber;
                        this.socket.emit('online', {
                            room: 'global',
                            user: userSocket
                        });
                        return this.cometChatService.login(this.tokenService.getPayload()._id);
                    }), catchError((err: any) => {
                        if (err && err.status === 401) {
                            if (err.error.message && err.error.message === 'Account Subscription Disabled') {
                                this.openPaymentErrorModal();
                            } else if (err.error.message && err.error.message === 'User deleted') {
                                this.loginState = 'userDeleted';
                            } else if (err.error.message && err.error.message === 'Account is not activated') {
                                this.loginState = 'userNotActivated';
                                document.getElementById('modalOpenButton').click();
                            } else if (err.error.message && err.error.message === 'Account is temporary suspend') {
                                this.loginState = 'userTemporarySuspend';
                            } else if (err.error.message && err.error.message === 'Account is permanent suspend') {
                                this.loginState = 'userPermanentSuspend';
                            } else {
                                this.loginState = 'error';
                            }
                        }
                        return of(err);
                    })
                ).subscribe((res: any) => {
                    this.cometChatService.loggedIn.next(true);
                    if (this.loginState !== 'error' && this.loginState !== 'userNotActivated') {
                        this.closeAllModal();
                        this.router.navigate(['/eisdiele']);
                    }
                });
            }
        }, (err: any) => {
            if (err && err.status === 404) {
                this.loginState = 'error';
            }
            return err;
        });
    }

    closeAllModal() {
        this.modalService.dismissAll();
    }

    getUserProfileName() {
        return this.userService.getUserProfileFromStorage();
    }

    typeFnc() {
        this.show = !this.show;
    }

    initializeLoginForm() {
        this.loginForm = this.fb.group({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }

    calculateAge(birthday) {
        if (birthday) {
            const date1 = moment(birthday);
            const date2 = moment();
            return date2.diff(date1, 'years');
        } else {
            return null;
        }
    }

    logout() {
        this.socket.emit('offline');
        this.userService.logout().subscribe();
        this.userService.loginTime(new Date()).subscribe();
        this.router.navigate(['/']);
    }

    changeSliderPauseHover(param: string) {
        this.eventManager.broadcast({
            name: 'main-page-slider-pause-changed',
            content: param
        });
    }

    forgetPasswordModalToggle(forgetPassoword) {
        const email = this.loginForm.value.email;
        this.isSuccessForgetPassword = false;
        this.modalService.open(forgetPassoword, {centered: true});
        this.forgetPasswordForm.patchValue({email: email});
    }

    sendResetPassword(modal) {
        const email = this.forgetPasswordForm.value.email;
        this.userService.sendPasswordToEmail(email).subscribe(value => {
            this.isSuccessForgetPassword = true;
        }, error => {
            this.isSuccessForgetPassword = false;
        });
    }

    emailCheckValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            return this.userService.findUserByEmail(control.value)
                .pipe(
                    map(res => {
                        if (!res) {
                            return {'emailExist': true};
                        } else {
                            return null;
                        }
                    })
                );
        };
    }

    openPaymentErrorModal() {
        const modal = this.modalService.open(PaymentErrorModalComponent, {centered: true});
    }

    openAgbModal() {
        const user: IUser = this.loginForm.value;
        const email = user.email;
        const modal = this.modalService.open(CheckAgbModalComponent, {scrollable: true, size: 'xl', windowClass: 'modal-top-off'});
        modal.componentInstance.bsModalRef = modal;
        modal.componentInstance.email = email;
    }

    listenAgbConfirmation() {
        this.agbEventSubscriber = this.eventManager.subscribe('click-agb-submit-button', data => {
           this.login(true);
        });
    }

    ngOnDestroy() {
        if (this.agbEventSubscriber) {
            this.agbEventSubscriber.unsubscribe();
        }
    }
}
