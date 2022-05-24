import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {IUser, User} from '../../../model/user.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {concat, Observable, Subject} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {catchError, debounceTime, distinctUntilChanged, mergeMap, switchMap, tap} from 'rxjs/operators';
import {SettingsService} from '../../../services/settings.service';
import {ISettings} from '../../../model/settings.model';
import {TranslateService} from '@ngx-translate/core';
import {IRole} from '../../../model/role.model';
import {MustMatch} from '../../../util/must-match.validator';
import {CometChatService} from '../../../services/comet-chat.service';
import {Router} from '@angular/router';
import {Socket} from 'ngx-socket-io';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    emailAdressEdit = false;
    profileNameEdit = false;
    passwordEdit = false;
    dateEdit = false;
    public existOldProfileNameErrMessage = null;

    user: IUser;
    days: number[];
    months: number[];
    years: number[];
    age: number;

    day: number;
    month: number;
    year: number;

    profileSettingForm: FormGroup;
    isUnsubscribe = false;
    isOneWeekPremium = false;
    isPremiumForOneWeekFinished = false;
    users$: Observable<User[]>;
    userLoading = false;
    userListInput$ = new Subject<string>();
    selectedUser: IUser;
    blockListUsers: IUser[];
    isActiveBuyButton: boolean;
    isPremium = false;

    public emailPattern = '^[A-Za-z0-9äöüçğÄÖÜßÇĞ._%+-]+@[A-Za-z0-9äöüçğÄÖÜßÇĞ.-]+\\.[a-z]{2,4}$';
    public noSpecialCharacterPatter = '^[a-zA-Z0-9äöüÄÖÜß_-]*$';
    public passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,}$/;
    public settings: ISettings;

    dynamicwidth: any;
    showPassword = false;
    showRePassword = false;

    public deleteAccountModalRef: NgbModalRef

    constructor(public userService: UserService,
                private settingsService: SettingsService,
                private translateService: TranslateService,
                public fb: FormBuilder,
                private cometChatService: CometChatService,
                private router: Router,
                private modalService: NgbModal,
                private socket: Socket) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnInit() {
        this.initializeForm();
        this.initDateValues();
        this.findCurrentUserProfile();
        this.loadUsers();

        setTimeout(() => {
            const element = document.getElementById('profileNameWidth');
            if (element) {
                const dynamicElement = document.getElementById('profileNameWidth').offsetWidth;
                this.dynamicwidth = dynamicElement;
            }

        }, 2000);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        const element = document.getElementById('profileNameWidth');
        if (element) {
            const dynamicElement = document.getElementById('profileNameWidth').offsetWidth;
            this.dynamicwidth = dynamicElement;
        }
    }

    fillBirtDayFromBackend(data) {
        this.day = null;
        this.month = null;
        this.year = null;
        if (data.response && data.response.birthday) {
            const birthDay = data.response.birthday ? moment(data.response.birthday, '"YYYY-MM-DD HH:mm Z"') : null;
            this.day = birthDay ? birthDay.date() - 1 : null;
            this.month = birthDay ? birthDay.month() + 1 : null;
            this.year = birthDay ? birthDay.year() : null;
        }
    }

    initDateValues() {
        this.days = Array.from(new Array(31), (val, index) => index + 1);
        this.months = Array.from(new Array(12), (val, index) => index + 1);

        const lengthOfYear = new Date().getFullYear() - 1930 + 1;
        this.years = Array.from(new Array(lengthOfYear), (val, index) => index + 1930);
    }

    findCurrentUserProfile() {
        this.settingsService.findOne().pipe(
            mergeMap((data: any) => {
                if (data && data.body) {
                    const response = data.body[0];
                    this.settings = response;
                }
                return this.userService.findCurrentUserProfile();
            })
        ).subscribe((data: any) => {
            const user: IUser = data.response;
            this.age = this.calculateAge(data);
            this.user = user;
            this.isUnsubscribe = user.unsubscribeDetail.isUnsubscribe;
            this.isOneWeekPremium = user.premiumForOneWeek.isPremiumForOneWeek;
            this.isPremiumForOneWeekFinished = user.premiumForOneWeek.isPremiumForOneWeekFinished;
            this.isPremium = this.userService.isCurrentUserHasRole('ROLE_PREMIUM');
            if (this.user.gender) {
                if (this.user.gender.name === 'Female' || this.userService.isCurrentUserHasRole('ROLE_PREMIUM')) {
                    this.isActiveBuyButton = false;
                } else {
                    this.isActiveBuyButton = true;
                }
            }
            this.fillBirtDayFromBackend(data);
            this.blockListUsers = this.user.blockUserList;
            this.profileSettingForm.patchValue({
                profileName: user.profileName,
                email: user.email,
                day: this.day,
                month: this.month,
                year: this.year,
                isAccountDisabled: user.isAccountDisabled,
                isEmailNotifyRequired: user.isEmailNotifyRequired,
                isWantPartnerOffer: user.isWantPartnerOffer,
                isWeeklyAccountStatics: user.isWeeklyAccountStatics,
                isEmailNotifyForReceipt: user.isEmailNotifyForReceipt,
                isAcceptAutoStartVideo: user.isAcceptAutoStartVideo,
                isAutoStatics: user.isAutoStatics,
                isShowWhoIsOnline: user.isShowWhoIsOnline,
                isHolidaysMode: user.isHolidaysMode,
                isMessageEmail: user.isMessageEmail
            });
        });
    }

    editable(value) {
        switch (value) {
            case('profileName'): {
                this.profileNameEdit = true;
            }
                break;
            case ('email'): {
                this.emailAdressEdit = true;
            }
                break;
            case ('password'): {
                this.passwordEdit = true;
            }
                break;
            case ('date'): {
                this.dateEdit = true;
            }
                break;
            default: {
                this.profileNameEdit = false;
                this.emailAdressEdit = false;
                this.passwordEdit = false;
                this.dateEdit = false;
            }
        }
    }

    editableFalse(value) {
        switch (value) {
            case('profileName'): {
                this.profileNameEdit = false;
            }
                break;
            case ('email'): {
                this.emailAdressEdit = false;
            }
                break;
            case ('password'): {
                this.passwordEdit = false;
            }
                break;
            case ('date'): {
                this.dateEdit = false;
            }
                break;
            default: {
                this.profileNameEdit = false;
                this.emailAdressEdit = false;
                this.passwordEdit = false;
                this.dateEdit = false;
            }
        }
    }

    changeProfileInfo(param: string) {
        const userReq: IUser = new User();

        if (param === 'profileName') {
            this.existOldProfileNameErrMessage = null;
            userReq.profileName = this.profileSettingForm.controls.profileName.value;
        }

        if (param === 'email') {
            userReq.email = this.profileSettingForm.controls.email.value;
        }

        if (param === 'isMessageEmail') {
            userReq.isMessageEmail = this.profileSettingForm.controls.isMessageEmail.value;
        }

        if (param === 'isAccountDisabled') {
            userReq.isAccountDisabled = this.profileSettingForm.controls.isAccountDisabled.value;
        }

        if (param === 'isEmailNotifyRequired') {
            userReq.isEmailNotifyRequired = this.profileSettingForm.controls.isEmailNotifyRequired.value;
        }

        if (param === 'isWantPartnerOffer') {
            userReq.isWantPartnerOffer = this.profileSettingForm.controls.isWantPartnerOffer.value;
        }

        if (param === 'isWeeklyAccountStatics') {
            userReq.isWeeklyAccountStatics = this.profileSettingForm.controls.isWeeklyAccountStatics.value;
        }

        if (param === 'isEmailNotifyForReceipt') {
            userReq.isEmailNotifyForReceipt = this.profileSettingForm.controls.isEmailNotifyForReceipt.value;
        }

        if (param === 'isAcceptAutoStartVideo') {
            userReq.isAcceptAutoStartVideo = this.profileSettingForm.controls.isAcceptAutoStartVideo.value;
        }

        if (param === 'isAutoStatics') {
            userReq.isAutoStatics = this.profileSettingForm.controls.isAutoStatics.value;
        }

        if (param === 'isHolidaysMode') {
            userReq.isHolidaysMode = this.profileSettingForm.controls.isHolidaysMode.value;
        }

        if (param === 'isShowWhoIsOnline') {
            userReq.isShowWhoIsOnline = this.profileSettingForm.controls.isShowWhoIsOnline.value;
        }

        this.userService.changeProfileInfo(userReq).subscribe((data: any) => {
            const user = data.body.response;
            this.user = user;
            this.calculateAge(data.body);
            if (param === 'profileName') {
                this.profileNameEdit = false;
                this.user.profileName = user.profileName;
                this.profileSettingForm.patchValue({
                    profileName: user.profileName
                });
            } else if (param === 'email') {
                this.emailAdressEdit = false;
                this.user.email = user.email;
                this.profileSettingForm.patchValue({
                    email: user.email
                });
            } else if (param === 'isAccountDisabled') {
                this.profileSettingForm.patchValue({
                    isAccountDisabled: user.isAccountDisabled
                });
            } else if (param === 'isEmailNotifyRequired') {
                this.profileSettingForm.patchValue({
                    isEmailNotifyRequired: user.isEmailNotifyRequired
                });
            } else if (param === 'isWeeklyAccountStatics') {
                this.profileSettingForm.patchValue({
                    isWeeklyAccountStatics: user.isWeeklyAccountStatics
                });
            } else if (param === 'isEmailNotifyForReceipt') {
                this.profileSettingForm.patchValue({
                    isEmailNotifyForReceipt: user.isEmailNotifyForReceipt
                });
            } else if (param === 'isAcceptAutoStartVideo') {
                this.profileSettingForm.patchValue({
                    isAcceptAutoStartVideo: user.isAcceptAutoStartVideo
                });
            } else if (param === 'isAutoStatics') {
                this.profileSettingForm.patchValue({
                    isAutoStatics: user.isAutoStatics
                });
            } else if (param === 'isShowWhoIsOnline') {
                this.profileSettingForm.patchValue({
                    isShowWhoIsOnline: user.isShowWhoIsOnline
                });
            } else if (param === 'isMessageEmail') {
                this.profileSettingForm.patchValue({
                    isMessageEmail: user.isMessageEmail
                });
            }
        }, (res: any) => {
            if (res.error.error === 'Sie können den Profilnamen nicht ändern') {
                this.existOldProfileNameErrMessage = res.error.error;
                this.profileNameEdit = false;
                this.profileSettingForm.patchValue({
                    profileName: this.user.profileName
                });
            }

        });
    }

    changePassword() {
        const userReq: IUser = new User();
        userReq.password = this.profileSettingForm.controls.password.value;
        this.userService.changePassword(userReq).subscribe((data: any) => {
            this.passwordEdit = false;
        });
    }

    initializeForm() {
        this.profileSettingForm = this.fb.group({
            profileName: new FormControl(null, [Validators.required,
                Validators.maxLength(15), Validators.pattern(this.noSpecialCharacterPatter)]),
            email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
            password: new FormControl(null, [Validators.required, Validators.pattern(this.passwordPattern)]),
            rePassword: new FormControl(null, [Validators.required, Validators.pattern(this.passwordPattern)]),
            day: [''],
            month: [''],
            year: [''],
            isAccountDisabled: new FormControl(false),
            isEmailNotifyRequired: new FormControl(false),
            isWantPartnerOffer: new FormControl(false),
            isWeeklyAccountStatics: new FormControl(false),
            isEmailNotifyForReceipt: new FormControl(false),
            isAcceptAutoStartVideo: new FormControl(false),
            isAutoStatics: new FormControl(false),
            isShowWhoIsOnline: new FormControl(false),
            isHolidaysMode: new FormControl(false),
            isMessageEmail: new FormControl(false)
        }, {
            validator: MustMatch('password', 'rePassword')
        });
    }

    private loadUsers() {
        this.users$ = concat(
            of([]),
            this.userListInput$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.userLoading = true),
                switchMap(term => this.userService.getAllUsersByStartWithClubNumber(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.userLoading = false)
                ))
            )
        );
    }

    addUserToBlockList(selectedUser: IUser) {
        if (selectedUser) {
            this.userService.addUserToBlockList(selectedUser._id).pipe(
                mergeMap(value => {
                    this.selectedUser = null;
                    return this.userService.findCurrentUserProfile();
                })
            ).subscribe((data: any) => {
                this.blockListUsers = data.response.blockUserList;
            });
        }
    }

    removeUserBlockList(user: IUser) {
        if (user) {
            this.userService.removeUserToBlockList(user._id).pipe(
                switchMap(value => {
                    return this.userService.findCurrentUserProfile();
                })
            ).subscribe((data: any) => {
                this.blockListUsers = data.response.blockUserList;
            });
        }
    }

    calculateAge(data) {
        const userResult = data.response;
        if (userResult && userResult.birthday) {
            const date1 = moment(userResult.birthday);
            const date2 = moment();
            return date2.diff(date1, 'years');
        } else {
            return null;
        }
    }

    validateDate() {
        const mm = this.profileSettingForm.controls.month.value;
        const dd = this.profileSettingForm.controls.day.value;
        const yyyy = this.profileSettingForm.controls.year.value;
        const birthDay = moment(mm + '-' + dd + '-' + yyyy, 'MM-DD-YYYY');
        const result = moment(birthDay).isValid();
        return result;
    }

    showDatingUserRole(user) {
        if (user && user.gender) {
            const genderName = user.gender.name;
            const isRolePremium = this.isHasRole(user, 'ROLE_PREMIUM');

            if (genderName === 'Female') {
                return this.translateService.instant('Woman User');
            } else if (genderName === 'Male' && isRolePremium) {
                return this.translateService.instant('Paid Man User');
            } else if (genderName === 'Male' && !isRolePremium) {
                return this.translateService.instant('Non Paid Man User');
            } else if (genderName === 'Couple' && isRolePremium) {
                return this.translateService.instant('Paid Couple');
            } else if (genderName === 'Couple' && !isRolePremium) {
                return this.translateService.instant('Non Paid Couple');
            }
        }
    }

    isHasRole(user, roleName)
        :
        boolean {
        let result = false;
        const roles: IRole[] = user.roles;
        if (roles && roles.length > 0) {
            result = roles.filter((role: IRole) => role.name === roleName).length > 0 ? true : false;
        }
        return result;
    }

    get rePassword() {
        return this.profileSettingForm.get('rePassword');
    }

    typeFnc() {
        this.showPassword = !this.showPassword;
    }

    typeFncRePassword() {
        this.showRePassword = !this.showRePassword;
    }

    holidaysModeActive() {
        this.userService.holidaysModeActive().subscribe((data: any) => {
            this.cometChatService.logout().subscribe();
            this.socket.emit('offline');
            this.userService.logout().subscribe();
            this.userService.loginTime(new Date()).subscribe();
            this.router.navigate(['/']);
        });
    }

    unSubscribeStarted() {
        this.userService.userUnsubscribeStarted(this.user._id).subscribe((data: any) => {
            this.isUnsubscribe = true;
        });
    }

    startOneWeekPremium() {
        this.userService.oneWeekPremiumStarted(this.user._id).subscribe((data: any) => {
            this.cometChatService.logout().subscribe();
            this.socket.emit('offline');
            this.userService.logout().subscribe();
            this.userService.loginTime(new Date()).subscribe();
            this.router.navigate(['/']);
        });
    }

    closeModal(modal) {
        this.deleteAccountModalRef.close();

    }

    deleteAccountConfirm() {
        this.userService.delete(this.user._id).subscribe(value => {
            this.deleteAccountModalRef.close();
            this.socket.emit('offline');
            this.userService.logout().subscribe();
            this.userService.loginTime(new Date()).subscribe();
            this.router.navigate(['/']);
        }, error => {
            this.deleteAccountModalRef.close();
            this.socket.emit('offline');
            this.userService.logout().subscribe();
            this.userService.loginTime(new Date()).subscribe();
            this.router.navigate(['/']);
        })
    }

    openDeleteAccountModal(deleteAccountModal: TemplateRef<any>) {
        this.deleteAccountModalRef = this.modalService.open(deleteAccountModal);
    }
}
