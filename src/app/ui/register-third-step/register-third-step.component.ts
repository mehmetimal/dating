import {
    Component,
    DoCheck,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Observable, Subscription, throwError} from 'rxjs';
import {IUser} from '../../model/user.model';
import {EyeColorService} from '../../services/eye-color.service';
import {HairColorService} from '../../services/hair-color.service';
import {BodyTypesService} from '../../services/body-types.service';
import {HowToFindUsService} from '../../services/how-to-find-us.service';
import {RelationshipStatusService} from '../../services/relationship-status.service';
import {HairLengthService} from '../../services/hair-length.service';
import {HeightService} from '../../services/height.service';
import {LocationService} from '../../services/location.service';
import {catchError, mergeMap} from 'rxjs/operators';
import {ConfirmationService} from '../../services/confirmation.service';
import {RegisterPageConfigService} from '../../services/register-page-config.service';
import {ErrorService} from '../../services/error.service';
import {IProfileQuestion} from '../../model/profile-question.model';
import {EmailService} from '../../services/email.service';
import {CometChatService} from '../../services/comet-chat.service';
import {HttpResponse} from '@angular/common/http';
import {JhiEventManager} from '../../services/event-manager.service';
import {LoadingModalComponent} from '../../pages/register/loading-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from 'ngx-webstorage';
import * as converter from 'xml-js';

@Component({
    selector: 'app-register-third-step',
    templateUrl: './register-third-step.component.html'
})
export class RegisterThirdStepComponent implements OnInit, DoCheck, OnChanges, OnDestroy {
    @Output() saveChangeListener: EventEmitter<string> = new EventEmitter<string>();
    @Input() parentForm: FormGroup;
    @Input() profileQuestions: IProfileQuestion[];

    private genderChangedSubscriber: Subscription;
    private initializeFormSubscriber: Subscription;
    public registerNextButtonColor;
    public registerNextButtonTextColor;

    public eyeColorOptions$: Observable<HttpResponse<any[]>>;
    public hairColorOptions$: Observable<HttpResponse<any[]>>;
    public bodyTypesOptions$: Observable<HttpResponse<any[]>>;
    public howToFindUsOptions$: Observable<HttpResponse<any[]>>;
    public relationshipStatusOptions$: Observable<HttpResponse<any[]>>;
    public hairLengthOptions$: Observable<HttpResponse<any[]>>;
    public heightOptions$: Observable<HttpResponse<any[]>>;
    public locationOptions$: Observable<HttpResponse<any[]>>;

    agbText: string;
    dseText: string;
    registerThirdPageText: string;
    registerThirdPageTextState: boolean;

    bodyTypeTitle: string;
    eyeColorTitle: string;
    genderTitle: string;
    hairColorTitle: string;
    hairLengthTitle: string;
    heightTitle: string;
    howToFindUsTitle: string;
    locationTitle: string;
    relationShipStatusTitle: string;

    public isExistProfileName = false;
    public isExistEmail = false;

    constructor(private eventManager: JhiEventManager,
                public userService: UserService,
                private eyeColorService: EyeColorService,
                private hairColorService: HairColorService,
                private bodyTypesService: BodyTypesService,
                private howToFindUsService: HowToFindUsService,
                private relationshipStatusService: RelationshipStatusService,
                private hairLengthService: HairLengthService,
                private heightService: HeightService,
                private locationService: LocationService,
                private confirmationService: ConfirmationService,
                private registerPageConfigService: RegisterPageConfigService,
                private errorService: ErrorService,
                private emailService: EmailService,
                private cometChatService: CometChatService,
                private modalService: NgbModal,
                private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        this.initializeForm();
        this.genderChangedSubscriber = this.eventManager.subscribe(
            'register-second-step-form-changed',
            response => {
                this.parentForm.patchValue(response.content);
            }
        );
    }

    saveAndChangeStateForm() {
        this.loadingModal();
        this.isExistEmail = false;
        this.isExistProfileName = false;
        const user: IUser = this.fillBirthDay();
        user.registerId = this.localStorageService.retrieve('registerId');
        let to;
        this.userService.signUp(user).pipe(
            mergeMap((value: any) => {
                const userSaved: IUser = value.body.response;
                this.parentForm.patchValue({
                    id: userSaved._id,
                    clubNumber: userSaved.clubNumber
                });
                to = userSaved.email;
                return this.cometChatService.signUp(userSaved);
            }),
            catchError((err) => {
                return throwError(err);
            }),
            mergeMap((data: any) => {
                if (data) {
                    return this.emailService.sendEmail(to);
                } else {
                    return this.emailService.sendEmail(to);
                }

            })
        ).subscribe(
            (res) => {
                this.eventManager.broadcast({
                    name: 'register-second-step-form-changed',
                    content: this.parentForm.value
                });
                this.saveChangeListener.emit('registerSuccess');
                this.closeAllModal();
            },
            (err: any) => {
            }
        );
    }

    loadingModal() {
        const modalRef = this.modalService.open(LoadingModalComponent, {
            centered: true,
            backdropClass: 'loading-modal-backdrop',
            windowClass: 'loading-modal-backdrop',
            backdrop: 'static'
        });
    }

    closeAllModal() {
        this.modalService.dismissAll();
    }

    initializeForm() {
        this.eyeColorOptions$ = this.eyeColorService.findAll();
        this.hairColorOptions$ = this.hairColorService.findAll();
        this.bodyTypesOptions$ = this.bodyTypesService.findAll();
        this.howToFindUsOptions$ = this.howToFindUsService.findAll();
        this.relationshipStatusOptions$ = this.relationshipStatusService.findAll();
        this.hairLengthOptions$ = this.hairLengthService.findAll();
        this.heightOptions$ = this.heightService.findAll();
        this.locationOptions$ = this.locationService.findAll();

        this.initializeFormSubscriber = this.confirmationService.findConfirmationTexts().pipe(
            mergeMap((data: any) => {
                if (data.body.response && data.body.response[0]) {
                    this.agbText = data.body.response[0].agbText;
                    this.dseText = data.body.response[0].dseText;
                }
                return this.registerPageConfigService.getRegisterThirdPageConfig();
            })
        ).subscribe((data: any) => {
            this.registerThirdPageText = data.response.registerThirdPageText;
            this.registerThirdPageTextState = data.response.registerThirdPageTextState;

            if (data.response.registerNextButtonColor) {
                this.registerNextButtonColor = data.response.registerNextButtonColor;
            }

            if (data.response.registerNextButtonTextColor) {
                this.registerNextButtonTextColor = data.response.registerNextButtonTextColor;
            }
        });
    }

    validateFieldWithBackend() {
        const user = this.fillBirthDay();
        this.userService.validateRegisterThirdPage(user).subscribe((data: any) => {
            this.saveAndChangeStateForm();
        }, error => {
            this.errorService.validateBackendErrors(this.parentForm, error);
        });
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

    ngDoCheck(): void {
        if (this.parentForm.valid) {
            const element = document.getElementById('registerThirdNextButton');

            if (this.registerNextButtonColor) {
                element.style.setProperty('background-color', this.registerNextButtonColor, 'important');
            }

            if (this.registerNextButtonColor) {
                element.style.setProperty('color', this.registerNextButtonColor, 'important');
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['profileQuestions'] && this.profileQuestions) {
            this.bodyTypeTitle = this.profileQuestions.find(value => value.typeId === 1)
                ? this.profileQuestions.find(value => value.typeId === 1).name : null;

            this.eyeColorTitle = this.profileQuestions.find(value => value.typeId === 2)
                ? this.profileQuestions.find(value => value.typeId === 2).name : null;

            this.genderTitle = this.profileQuestions.find(value => value.typeId === 3)
                ? this.profileQuestions.find(value => value.typeId === 3).name : null;

            this.hairColorTitle = this.profileQuestions.find(value => value.typeId === 4)
                ? this.profileQuestions.find(value => value.typeId === 4).name : null;


            this.hairLengthTitle = this.profileQuestions.find(value => value.typeId === 5)
                ? this.profileQuestions.find(value => value.typeId === 5).name : null;

            this.heightTitle = this.profileQuestions.find(value => value.typeId === 6)
                ? this.profileQuestions.find(value => value.typeId === 6).name : null;

            this.howToFindUsTitle = this.profileQuestions.find(value => value.typeId === 7)
                ? this.profileQuestions.find(value => value.typeId === 7).name : null;

            this.locationTitle = this.profileQuestions.find(value => value.typeId === 8)
                ? this.profileQuestions.find(value => value.typeId === 8).name : null;

            this.relationShipStatusTitle = this.profileQuestions.find(value => value.typeId === 9)
                ? this.profileQuestions.find(value => value.typeId === 9).name : null;
        }
    }

    ngOnDestroy(): void {
        if (this.genderChangedSubscriber) {
            this.genderChangedSubscriber.unsubscribe();
        }
        if (this.initializeFormSubscriber) {
            this.initializeFormSubscriber.unsubscribe();
        }
    }
}
