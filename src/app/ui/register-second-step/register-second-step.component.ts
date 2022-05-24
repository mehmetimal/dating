import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as moment from 'moment';
import {GenderService} from '../../services/gender.service';
import {mergeMap} from 'rxjs/operators';
import {RegisterPageConfigService} from '../../services/register-page-config.service';
import {UserService} from '../../services/user.service';
import {IUser} from '../../model/user.model';
import {ErrorService} from '../../services/error.service';
import {IProfileQuestion} from '../../model/profile-question.model';
import {RegisterPinService} from '../../services/register-pin.service';
import {JhiEventManager} from '../../services/event-manager.service';

declare var google;

@Component({
    selector: 'app-register-second-step',
    templateUrl: './register-second-step.component.html',
    styleUrls: ['./register-second-step.component.css']
})
export class RegisterSecondStepComponent implements OnInit, OnDestroy {
    @Input() parentForm: FormGroup;
    @Output() stateChangeListener: EventEmitter<string> = new EventEmitter<string>();
    @Input() isFacebookLoginActive: boolean;
    @Input() profileQuestions: IProfileQuestion[];

    private genderChangedSubscriber: Subscription;
    private initializeSubscriber: Subscription;
    private secondPageSubscriber: Subscription;

    public isPinActive = false;
    public isEmailExist = false;

    show = false;
    showPin = false;
    days: number[];
    months: number[];
    years: number[];
    questOptions: any[];
    registerSecondPageText: string;
    registerSecondPageTextState: boolean;

    public isFocus = true;

    constructor(private eventManager: JhiEventManager,
                private genderService: GenderService,
                private registerPageConfigService: RegisterPageConfigService,
                public userService: UserService,
                private errorService: ErrorService,
                private registerPinService: RegisterPinService
    ) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnInit() {
        this.initializeForm();
        this.genderChangedSubscriber = this.eventManager.subscribe(
            'register-second-step-form-changed',
            response => {
                this.parentForm.patchValue(response.content);
            }
        );
        this.show = false;
        this.showPin = false;
    }

    typeFnc() {
        this.show = !this.show;
    }

    typeFncPin() {
        this.showPin = !this.showPin;
    }

    initDateValues() {
        this.days = Array.from(new Array(31), (val, index) => index + 1);
        this.months = Array.from(new Array(12), (val, index) => index + 1);

        const lengthOfYear = (new Date().getFullYear() - 18) - 1930 + 1;
        this.years = Array.from(new Array(lengthOfYear), (val, index) => index + 1930);
    }

    changeStateForm() {
        // this.resetFormValidation();
        this.isEmailExist = false;
        const email = this.parentForm.controls.email.value;
        this.userService.isEmailExist(email).subscribe(value => {
            this.isEmailExist = false;
            if (this.validateForm()) {
                this.isPinActive ? this.validateRegisterPin() : this.getAddressFromCode();
            }
        }, error => {
            this.isEmailExist = true;
        });
    }

    validateForm() {
        const email = this.parentForm.controls.email;
        const password = this.parentForm.controls.password;
        const gender = this.parentForm.controls.gender;
        const searchGender = this.parentForm.controls.searchGender;
        const postCode = this.parentForm.controls.postCode;
        const pin = this.parentForm.controls.pin;

        const day = this.parentForm.controls.day;
        const month = this.parentForm.controls.month;
        const year = this.parentForm.controls.year;


        if (email.invalid) {
            email.markAsDirty();
        }

        if (password.invalid) {
            password.markAsDirty();
        }
        if (postCode.invalid) {
            postCode.markAsDirty();
        }

        if (gender.invalid) {
            gender.markAsDirty();
        }

        if (searchGender.invalid) {
            searchGender.markAsDirty();
        }

        if (this.isPinActive && pin.invalid) {
            pin.markAsDirty();
        }

        if (!this.validateDate()) {
            day.setErrors({'incorrect': true});
            month.setErrors({'incorrect': true});
            year.setErrors({'incorrect': true});
            day.markAsDirty();
            month.markAsDirty();
            year.markAsDirty();
        } else {
            day.setErrors(null);
            month.setErrors(null);
            year.setErrors(null);
            day.markAsDirty();
            month.markAsDirty();
            year.markAsDirty();
        }

        if (email.invalid || password.invalid || gender.invalid || searchGender.invalid || postCode.invalid || !this.validateDate()) {
            return false;
        } else {
            return true;
        }
    }

    validateFieldWithBackend() {
        const user = this.fillBirthDay();
        this.secondPageSubscriber = this.userService.validateRegisterSecondPage(user).subscribe((data: any) => {
            this.eventManager.broadcast({
                name: 'register-second-step-form-changed',
                content: this.parentForm.value
            });
            this.stateChangeListener.emit('registerThree');
        }, error => {
            this.errorService.validateBackendErrors(this.parentForm, error);
        });
    }

    initializeForm() {
        this.isPinActive = false;
        this.initializeSubscriber = this.genderService.findAll().pipe(
            mergeMap((data: any) => {
                this.initDateValues();
                this.questOptions = data.body.response;
                return this.registerPinService.isExistActivePin();
            }),
            mergeMap((data: any) => {
                const res = data.body;
                if (res) {
                    this.parentForm.addControl('pin', new FormControl(null, Validators.required));
                    this.isPinActive = true;
                } else {
                    this.isPinActive = false;
                }
                return this.registerPageConfigService.getRegisterSecondPageConfig();
            })
        ).subscribe((data: any) => {
            this.registerSecondPageText = data.response.registerSecondPageText;
            this.registerSecondPageTextState = data.response.registerSecondPageTextState;

            const element = document.getElementById('registerSecondNextButton');

            if (data.response.registerNextButtonColor) {
                element.style.setProperty('background-color', data.response.registerNextButtonColor, 'important');
            }

            if (data.response.registerNextButtonTextColor) {
                element.style.setProperty('color', data.response.registerNextButtonTextColor, 'important');
            }
        });
    }

    validateDate() {
        const mm = this.parentForm.controls.month.value;
        const dd = this.parentForm.controls.day.value;
        const yyyy = this.parentForm.controls.year.value;
        const birthDay = moment(mm + '-' + dd + '-' + yyyy, 'MM-DD-YYYY');
        const result = moment(birthDay).isValid();
        let is18YearsOld = true;
        if (result) {
            const yearsDiff = moment().diff(birthDay, 'years');
            is18YearsOld = yearsDiff >= 18 ? true : false;
        }
        return result && is18YearsOld ? true : false;
    }

    fillBirthDay() {
        const user: IUser = this.parentForm.value;
        if ((this.parentForm.controls.year && this.parentForm.controls.month && this.parentForm.controls.day) &&
            (this.parentForm.controls.year.value && this.parentForm.controls.month.value && this.parentForm.controls.day.value)
        ) {
            user.birthday = this.parentForm.controls.month.value + '/'
                + (+this.parentForm.controls.day.value + 1) + '/' + this.parentForm.controls.year.value;
        }
        return user;
    }

    ngOnDestroy(): void {
        if (this.genderChangedSubscriber) {
            this.genderChangedSubscriber.unsubscribe();
        }

        if (this.initializeSubscriber) {
            this.initializeSubscriber.unsubscribe();
        }

        if (this.secondPageSubscriber) {
            this.secondPageSubscriber.unsubscribe();
        }
    }

    getLocationFromAddress(address, postCode) {
        return new Promise(function(resolve, reject) {
            const geocoder = new google.maps.Geocoder();
            let lat = '';
            let lng = '';
            geocoder.geocode({
                    componentRestrictions: {
                        country: 'DE',
                        postalCode: postCode
                    }
                    // tslint:disable-next-line:only-arrow-functions
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
                        resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
                    } else {
                        reject(new Error('Standort 23 konnte nicht gefunden werden ' + address));
                    }
                }
            );
        });
    }

    getAddressFromCode() {
        const postCode = this.parentForm.controls.postCode;
        if (postCode.value && postCode.value.length > 0) {
            this.getLocationFromAddress(postCode.value + ' Germany', postCode.value).then(value => {
                postCode.setErrors(null);
                postCode.markAsDirty();
                this.validateFieldWithBackend();
            }).catch(reason => {
                postCode.setErrors({'incorrect': true});
                postCode.markAsDirty();
                return false;
            });
        } else {
            this.validateFieldWithBackend();
        }

    }

    validateRegisterPin() {
        const pin = this.parentForm.controls.pin;
        if (pin.value && pin.value.length > 0) {
            this.registerPinService.findOneByActive(pin.value).subscribe((data: any) => {
                if (data) {
                    pin.setErrors(null);
                    pin.markAsDirty();
                    this.getAddressFromCode();
                } else {
                    pin.setErrors({'incorrect': true});
                    pin.markAsDirty();
                    return false;
                }
            }, error => {
                pin.setErrors({'incorrect': true});
                pin.markAsDirty();
                return false;
            });
        }
    }

    resetFormValidation() {
        let control: AbstractControl = null;
        Object.keys(this.parentForm.controls).forEach((name) => {
            control = this.parentForm.controls[name];
            control.setErrors(null);
        });
    }

    onFocus() {
        this.isFocus = true;
    }

    outFocus() {
        this.isFocus = false;
    }
}
