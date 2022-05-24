import {Component, Inject, Injector, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {TokenService} from '../../services/token.service';
import {Socket} from 'ngx-socket-io';
import {Router} from '@angular/router';
import {ClientIpService} from '../../services/client-ip.service';
import {CometChatService} from '../../services/comet-chat.service';
import {IUser, User} from '../../model/user.model';
import {catchError, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {JhiEventManager} from '../../services/event-manager.service';
import * as moment from 'moment';
import {AddcellService} from '../../services/addcell.service';

@Component({
    selector: 'app-login-secret',
    templateUrl: './login-secret.component.html'
})
export class LoginSecretComponent implements OnInit {

    @Input() cardBackgroundColor;
    public isAuthenticated: boolean;
    loginForm: FormGroup;
    loginState: string;
    show = false;
    public socket: Socket;
    public clientIpService: ClientIpService;
    public cometChatService: CometChatService;
    public tokenService: TokenService;
    public userService: UserService;

    constructor(
        private injector: Injector,
        private eventManager: JhiEventManager,
        public fb: FormBuilder,
        private addcellService: AddcellService,
        @Inject(PLATFORM_ID) private platformId: any,
        public router: Router,
    ) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            this.tokenService = this.injector.get<TokenService>(TokenService);
            this.clientIpService = this.injector.get<ClientIpService>(ClientIpService);
            this.cometChatService = this.injector.get<CometChatService>(CometChatService);
            this.userService = this.injector.get<UserService>(UserService);
            this.isAuthenticated = this.userService.getToken() ? true : false;
        }

        this.initializeLoginForm();
    }

    login() {
        const user: IUser = this.loginForm.value;
        user.isSecretLogin = true;
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
                            if (err.error.message && err.error.message === 'Account is not activated') {
                                this.loginState = 'userNotActivated';
                                document.getElementById('modalOpenButton').click();
                            } else {
                                this.loginState = 'error';
                            }
                        }
                        return of(err);
                    })
                ).subscribe((res: any) => {
                    this.cometChatService.loggedIn.next(true);
                    if (this.loginState !== 'error' && this.loginState !== 'userNotActivated') {
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

    getUserProfileName() {
        return this.userService.getUserProfileFromStorage();
    }

    typeFnc() {
        this.show = !this.show;
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

    initializeLoginForm() {
        this.loginForm = this.fb.group({
            email: [''],
            password: ['']
        });
    }
}
