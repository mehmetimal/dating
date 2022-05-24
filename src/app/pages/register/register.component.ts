import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {RegisterPageConfigService} from '../../services/register-page-config.service';
import {environment} from '../../../environments/environment';
import {RegisterPageImageService} from '../../services/register-page-image.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Observable, of, Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {SystemConfigService} from '../../services/system-config.service';
import {JhiEventManager} from '../../services/event-manager.service';
import {IProfileQuestion} from '../../model/profile-question.model';
import {ProfileQuestionService} from '../../services/profile-question.service';

@Component({
    selector: 'app-registrer',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [NgbCarouselConfig]
})
export class RegisterComponent implements OnInit, OnDestroy {
    public noSpecialCharacterPatter = '^[a-zA-Z0-9äöüÄÖÜß_-]*$';
    public passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\\w\\s]).{8,}$/;
    public emailPattern = '^[A-Za-z0-9äöüçğÄÖÜßÇĞ._%+-]+@[A-Za-z0-9äöüçğÄÖÜßÇĞ.-]+\\.[a-z]{2,4}$';
    public state: string;
    public cardPosition: string;
    public cardBackgroundColor: string;
    public resourceUrl: string;

    private systemConfigServiceSubs: Subscription;
    private sliderPauseOrNotSubs: Subscription;

    registerForm: FormGroup;
    images: any[];
    profileQuestions: IProfileQuestion[];
    isRegisterPageActive = true;
    defaultSlideIntervalValue;
    slideIntervalValue;
    isFacebookLoginActive;

    constructor(private eventManager: JhiEventManager,
                private systemConfigService: SystemConfigService,
                public fb: FormBuilder,
                private registerPageConfigService: RegisterPageConfigService,
                public userService: UserService,
                private registerPageImageService: RegisterPageImageService,
                private profileQuestionService: ProfileQuestionService,
                private router: Router
    ) {
        // slide right left icon disabled
    }

    ngOnInit() {
        this.subscribeToSliderPauseOrNot();
        if (this.isAuthenticated()) {
            this.router.navigateByUrl('/profile');
        }
        this.resourceUrl = environment.url;
        this.configureRegisterPage();
        this.initializeRegisterForm();
    }

    configureRegisterPage() {
        this.images = [];

        let imageArr: any[];
        this.systemConfigService.findAll().subscribe((data) => {
            const response = data.body;
            response.forEach((result) => {
                this.defaultSlideIntervalValue = result.sliderTimer;
                this.slideIntervalValue = this.defaultSlideIntervalValue;
                this.isFacebookLoginActive = result.isFacebookLoginActive;

            });
        });
        this.systemConfigServiceSubs = this.registerPageImageService.findAll().pipe(
            mergeMap((data: any) => {
                imageArr = data.body.registerPageImages;
                return this.profileQuestionService.findAll();
            }),
            mergeMap((data: any) => {
                this.profileQuestions = data.body.response;
                return this.registerPageConfigService.getRegisterPageConfig();
            }),
            catchError(err => of({
                response: {
                    _id: null,
                    registerPageCardPosition: null,
                    registerPageCardBackground: null,
                    templateIsActive: false
                }
            }))
        ).subscribe((data: any) => {
            const firstImageName = imageArr[0];
            const dataResponse = data.response;
            let imagesWCheck = false;
            let imagesBCheck = false;
            let imagesRCheck = false;
            let imagesLCheck = false;
            let imagesDCheck = false;
            let imagesUCheck = false;

            let conflict = true;

            this.isRegisterPageActive = dataResponse.templateIsActive;

            imageArr.forEach((value: any) => {

                if (value.imageName.toLowerCase().indexOf('_w_') >= 0) {
                    imagesWCheck = true;
                }

                if (value.imageName.toLowerCase().indexOf('_b_') >= 0) {
                    imagesBCheck = true;
                }

                if (value.imageName.toLowerCase().indexOf('_r_') >= 0) {
                    imagesRCheck = true;
                }

                if (value.imageName.toLowerCase().indexOf('_l_') >= 0) {
                    imagesLCheck = true;
                }

                if (value.imageName.toLowerCase().indexOf('_u_') >= 0) {
                    imagesUCheck = true;
                }

                if (value.imageName.toLowerCase().indexOf('_d_') >= 0) {
                    imagesDCheck = true;
                }
            });

            if (imagesBCheck && !imagesWCheck) {
                conflict = false;

                if (!dataResponse.registerPageCardBackground) {
                    this.cardBackgroundColor = 'black';
                } else {
                    this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                }

            }
            if (imagesWCheck && !imagesBCheck) {
                conflict = false;
                if (!dataResponse.registerPageCardBackground) {
                    this.cardBackgroundColor = 'white';
                } else {
                    this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                }
            }

            if (imagesRCheck && !imagesLCheck) {
                conflict = false;
                if (!dataResponse.registerPageCardPosition) {
                    this.cardPosition = 'right';
                } else {
                    this.cardPosition = dataResponse.registerPageCardPosition;
                }
            }

            if (imagesLCheck && !imagesRCheck) {
                conflict = false;
                if (!dataResponse.registerPageCardPosition) {
                    this.cardPosition = 'left';
                } else {
                    this.cardPosition = dataResponse.registerPageCardPosition;
                }
            }

            if (imagesUCheck && !imagesDCheck) {
                conflict = false;
                if (!dataResponse.registerPageCardPosition) {
                    this.cardPosition = 'up';
                } else {
                    this.cardPosition = dataResponse.registerPageCardPosition;
                }
            }


            if (imagesDCheck && !imagesUCheck) {
                conflict = false;
                if (!dataResponse.registerPageCardPosition) {
                    this.cardPosition = 'down';
                } else {
                    this.cardPosition = dataResponse.registerPageCardPosition;
                }
            }


            if (dataResponse.registerPageCardPosition) {
                this.cardPosition = dataResponse.registerPageCardPosition;
            }

            if (dataResponse.registerPageCardBackground) {
                this.cardBackgroundColor = dataResponse.registerPageCardBackground;
            }

            if (conflict) {

                this.images = [];
                this.images[0] = firstImageName;

                if (!dataResponse.registerPageCardBackground) {
                    if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_w_') >= 0) {
                        this.cardBackgroundColor = 'white';
                    } else if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_b_') >= 0) {
                        this.cardBackgroundColor = 'black';
                    }
                } else {
                    this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                }

                if (!dataResponse.registerPageCardPosition) {
                    if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_l_') >= 0) {
                        this.cardPosition = 'left';
                    } else if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_r_') >= 0) {
                        this.cardPosition = 'right';
                    } else if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_u_') >= 0) {
                        this.cardPosition = 'up';
                    } else if (firstImageName && firstImageName.imageName.toLowerCase().indexOf('_d_') >= 0) {
                        this.cardPosition = 'down';
                    }
                } else {
                    this.cardPosition = dataResponse.registerPageCardPosition;
                }
            } else {
                this.images = imageArr;
            }
        });

    }

    initializeRegisterForm() {
        this.state = 'registerOne';
        this.registerForm = this.fb.group({
            id: new FormControl(null),
            email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
            password: new FormControl(null, [Validators.required, Validators.pattern(this.passwordPattern)]),
            gender: new FormControl(null, Validators.required),
            searchGender: new FormControl(null, Validators.required),
            day: new FormControl(null),
            month: new FormControl(null),
            year: new FormControl(null),
            postCode: new FormControl(null, Validators.required),
            profileName: new FormControl('',
                [Validators.maxLength(15), Validators.pattern(this.noSpecialCharacterPatter), Validators.required],
                this.userValidator()),
            eyeColour: new FormControl(null, Validators.required),
            height: new FormControl(null, Validators.required),
            hairColour: new FormControl(null, Validators.required),
            bodyBuild: new FormControl(null,Validators.required),
            hairLength: new FormControl(null, Validators.required),
            relationshipStatus: new FormControl(null,Validators.required),
            // searchArea: new FormControl(null),
            howToFindUs: new FormControl(null, Validators.required),
            agbButton: [false, Validators.pattern('true')],
            dseButton: [false, Validators.pattern('true')],
            clubNumber: new FormControl(null)
        });
    }

    userValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            return this.userService.isExistProfileName(control.value)
                .pipe(
                    map(res => {
                        console.log(res);
                        if (res) {
                            return { 'profileNameExist': true};
                        } else {
                            return null;
                        }
                    })
                );
        };
    }

    stateChangeListener(stateValue: string) {
        this.state = stateValue;
    }

    wizardStep(componentName) {
        if (componentName === 'registerOne') {
            this.state = 'registerOne';
        } else if (componentName === 'registerTwo') {
            this.state = 'registerTwo';
        } else if (componentName === 'registerThree') {
            this.state = 'registerThree';
        }
        this.eventManager.broadcast({
            name: 'register-second-step-form-changed',
            content: this.registerForm.value
        });
    }

    isAuthenticated() {
        const isAuthenticated = this.userService.getToken() ? true : false;
        return isAuthenticated;
    }

    changeIntervalOfSlides(value: number) {
        this.slideIntervalValue = value;
    }

    subscribeToSliderPauseOrNot() {
        this.sliderPauseOrNotSubs = this.eventManager.subscribe('main-page-slider-pause-changed', (res) => {
            if (res.content === 'stop') {
                this.slideIntervalValue = 0;
            } else if (res.content === 'continue') {
                this.slideIntervalValue = this.defaultSlideIntervalValue;

            }
        });
    }

    validateSecondRegisterForm() {
        const email = this.registerForm.controls.email;
        const password = this.registerForm.controls.password;
        const gender = this.registerForm.controls.gender;
        const searchGender = this.registerForm.controls.searchGender;
        const postCode = this.registerForm.controls.postCode;
        if (email.invalid || password.invalid || gender.invalid || searchGender.invalid || postCode.invalid || !this.validateDate()) {
            return false;
        } else {
            return true;
        }
    }

    validateDate() {
        const mm = this.registerForm.controls.month.value;
        const dd = this.registerForm.controls.day.value;
        const yyyy = this.registerForm.controls.year.value;
        const birthDay = moment(mm + '-' + dd + '-' + yyyy, 'MM-DD-YYYY');
        const result = moment(birthDay).isValid();
        return result;
    }

    ngOnDestroy(): void {
        if (this.systemConfigServiceSubs) {
            this.systemConfigServiceSubs.unsubscribe();
        }
        if (this.sliderPauseOrNotSubs) {
            this.sliderPauseOrNotSubs.unsubscribe();
        }
    }
}
