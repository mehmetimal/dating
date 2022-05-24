import {Component, Inject, Injector, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {ActivationLoginService} from '../../services/activation-login.service';
import {Socket} from 'ngx-socket-io';
import {CometChatService} from '../../services/comet-chat.service';
import {TokenService} from '../../services/token.service';
import {ClientIpService} from '../../services/client-ip.service';
import {catchError, switchMap} from 'rxjs/operators';
import {IUser, User} from '../../model/user.model';
import {of} from 'rxjs';
import * as moment from "moment";
import * as converter from "xml-js";

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html'
})
export class ActivateAccountComponent implements OnInit {
    public resultMessage: string;

    public data: any;
    public result: any;
    public loading = false;
    public show = false;
    public loginState;
    public socket: Socket;

    constructor(private injector: Injector,
                private route: ActivatedRoute,
                private userService: UserService,
                private clientIpService: ClientIpService,
                private tokenService: TokenService,
                private cometChatService: CometChatService,
                private router: Router,
                private activationLoginService: ActivationLoginService,
                @Inject(PLATFORM_ID) private platformId: any) {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
        }
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.get();
            this.resultMessage = null;
            this.loading = false;
            this.route.paramMap.subscribe((params: ParamMap) => {
                const userId = params.get('userId');
                this.activateAccount(userId);
            });
        }
    }

    get() {
        this.activationLoginService.findOne().subscribe((data: any) => {
            this.result = data.body.data;
            this.data = this.result;
            this.loading = true;
            const classList = 'classList';
            const type = 'type';
            setTimeout(() => {
                document.getElementById('showButton').addEventListener('click', (data) => {
                    const showIcon = document.getElementById('showIcon');
                    if (this.show) {
                        this.show = false;
                        showIcon[classList].remove('fa-eye-slash');
                        showIcon[classList].add('fa-eye');
                        document.getElementById('password')[type] = 'password';

                    } else {
                        this.show = true;
                        showIcon[classList].remove('fa-eye');
                        showIcon[classList].add('fa-eye-slash');
                        document.getElementById('password')[type] = 'text';
                    }
                });
            }, 3000);
        });
    }

    activateAccount(userId: string) {
        this.userService.activateAccount(userId).subscribe((res: any) => {
            this.resultMessage = 'Ihr Account ist verifiziert. Jetzt kannst du dich anmelden.';
        });
    }

    onSubmit() {
        const value = 'value';
        const email = document.getElementById('email')[value];
        const password = document.getElementById('password')[value];
        this.login(email, password);
    }

    login(email, password) {
        const user: IUser = {email, password};
        console.log(user);

        this.userService.getUserLockInfo(user.email).subscribe((data: any) => {
            if (!data) {
                this.loginState = 'error';
                document.getElementById('form-validation').innerText = 'Email or password is incorrect';
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
                document.getElementById('form-validation').innerText = 'User is locked';

            } else {
                this.clientIpService.getIp().pipe(
                    switchMap((ipData: any) => {
                        user.ipAddress = ipData.body.ip;
                        return this.userService.login(user);
                    }),
                    catchError((err: any) => {
                        user.ipAddress = '';
                        return this.userService.login(user);
                    }),
                    switchMap((value: any) => {
                        this.loginState = 'success';
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
                    }),
                    catchError((err: any) => {
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
                    if (this.loginState !== 'error' && this.loginState !== 'userNotActivated') {
                        this.router.navigate(['/eisdiele']);
                    }
                });
            }
        }, (err: any) => {
            if (err && err.status === 404) {
                this.loginState = 'error';
                document.getElementById('form-validation').innerText = 'Email or password is incorrect';
            }
            return err;
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

}
