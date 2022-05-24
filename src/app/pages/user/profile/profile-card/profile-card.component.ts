import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {IUser} from '../../../../model/user.model';
import {UserService} from '../../../../services/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GenderService} from '../../../../services/gender.service';
import {EyeColorService} from '../../../../services/eye-color.service';
import {RelationshipStatusService} from '../../../../services/relationship-status.service';
import {HairLengthService} from '../../../../services/hair-length.service';
import {BodyTypesService} from '../../../../services/body-types.service';
import {GalleryService} from '../../../../services/gallery.service';
import {HairColorService} from '../../../../services/hair-color.service';
import {mergeMap} from 'rxjs/operators';
import * as moment from 'moment';
import {HeightService} from '../../../../services/height.service';
import {SystemConfigService} from '../../../../services/system-config.service';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Socket} from "ngx-socket-io";
import {Router} from "@angular/router";

declare var google;

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
    @Input() clubNumber: any;
    @Input() data: any;
    user: IUser;
    informationForm: FormGroup;

    genderOptions: any[];
    hairColorOptions: any[];
    eyeColorOptions: any[];
    bodyTypesOptions: any[];
    hairLengthOptions: any[];
    heightOptions: any[];

    relationshipStatusOptions: any[];
    notEditable = true;
    editable = false;

    days: number[];
    months: number[];
    years: number[];
    age: number;

    public isGameActive = false;

    public deleteAccountModalRef: NgbModalRef

    constructor(public userService: UserService,
                private genderService: GenderService,
                public router: Router,
                private eyeColorService: EyeColorService,
                private heightService: HeightService,
                private relationshipStatusService: RelationshipStatusService,
                private hairLengthService: HairLengthService,
                private bodyTypesService: BodyTypesService,
                private galleryService: GalleryService,
                private hairColorService: HairColorService,
                private systemConfigService: SystemConfigService,
                private modalService: NgbModal,
                private socket: Socket,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.isGameActive = false;
        this.initializeProfilePage();
        this.subscribeToProfileCardChanged();
        this.initDateValues();
    }

    initializeProfilePage() {
        this.informationForm = new FormGroup({
            gender: new FormControl(null, Validators.required),
            day: new FormControl(null),
            month: new FormControl(null),
            year: new FormControl(null),
            state: new FormControl(null),
            postCode: new FormControl(null),
            eyeColour: new FormControl(null),
            height: new FormControl(null),
            hairColour: new FormControl(null),
            bodyBuild: new FormControl(null),
            hairLength: new FormControl(null),
            relationshipStatus: new FormControl(null),
            searchArea: new FormControl(null),
            howToFindUs: new FormControl(null)
        });
        this.initializeProfileInformation();
    }

    edit() {
        if (this.notEditable) {
            this.editable = true;
            this.notEditable = false;
        } else {

        }
    }

    save() {
        const user: IUser = this.fillBirthDay();
        this.userService.updateRegisterInformation(user).subscribe(value => {
            this.eventManager.broadcast({
                name: 'profileRegisterInfoModification',
                content: 'Profile RegisterInfo Modification'
            });
            this.editable = false;
        }, error1 => {
        });
        this.notEditable = true;
    }

    cancelSave() {
        this.editable = false;
        this.notEditable = true;
    }


    fillBirthDay() {
        const user: IUser = this.informationForm.value;
        if ((this.informationForm.controls.year && this.informationForm.controls.month && this.informationForm.controls.day)
            && (this.informationForm.controls.year.value && this.informationForm.controls.month.value
                && this.informationForm.controls.day.value)
        ) {
            user.birthday = this.informationForm.controls.month.value + '/'
                + (+this.informationForm.controls.day.value + 1) + '/' + this.informationForm.controls.year.value;
        }
        return user;
    }

    initDateValues() {
        this.days = Array.from(new Array(31), (val, index) => index + 1);
        this.months = Array.from(new Array(12), (val, index) => index + 1);

        const lengthOfYear = new Date().getFullYear() - 1930 + 1;
        this.years = Array.from(new Array(lengthOfYear), (val, index) => index + 1930);
    }

    initializeProfileInformation() {
        this.systemConfigService.findAll().pipe(
            mergeMap((data: any) => {
                this.isGameActive = data.body[0].isGameActive;
                return this.genderService.findAll();
            }),
            mergeMap((data: any) => {
                this.genderOptions = data.body.response;
                return this.hairColorService.findAll();
            }),
            mergeMap((data: any) => {
                this.hairColorOptions = data.body.response;
                return this.eyeColorService.findAll();
            }),
            mergeMap((data: any) => {
                this.eyeColorOptions = data.body.response;
                return this.bodyTypesService.findAll();
            }),
            mergeMap((data: any) => {
                this.bodyTypesOptions = data.body.response;
                return this.hairLengthService.findAll();
            }),
            mergeMap((data: any) => {
                this.hairLengthOptions = data.body.response;
                return this.heightService.findAll();
            }),
            mergeMap((data: any) => {
                this.heightOptions = data.body.response;
                return this.relationshipStatusService.findAll();
            })
        ).subscribe((data: any) => {
            this.relationshipStatusOptions = data.body.response;
            this.userService.findCurrentUserProfile().subscribe((res: any) => {
                if (res && res.response) {
                    this.getProfileCardValueFromBackend(res);
                }
            });
        });
    }

    getProfileCardValueFromBackend(data) {
        this.user = data.response;
        if (data.response && data.response.clubNumber) {
            this.clubNumber = data.response.clubNumber;
        }

        let day = null;
        let month = null;
        let year = null;

        if (data.response && data.response.birthday) {
            const birthDay = data.response.birthday ? moment(data.response.birthday, '"YYYY-MM-DD HH:mm Z"') : null;
            day = birthDay ? birthDay.date() - 1 : null;
            month = birthDay ? birthDay.month() + 1 : null;
            year = birthDay ? birthDay.year() : null;
        }

        this.informationForm.patchValue({
            gender: this.user ? this.user.gender ? this.user.gender._id : null : null,
            hairColour: this.user ? this.user.hairColour ? this.user.hairColour._id : null : null,
            height: this.user ? this.user.height ? this.user.height._id : null : null,
            eyeColour: this.user ? this.user.eyeColour ? this.user.eyeColour._id : null : null,
            bodyBuild: this.user ? this.user.bodyBuild ? this.user.bodyBuild._id : null : null,
            hairLength: this.user ? this.user.hairLength ? this.user.hairLength._id : null : null,
            postCode: this.user ? this.user.postCode ? this.user.postCode : null : null,
            relationshipStatus: this.user ? this.user.relationshipStatus ? this.user.relationshipStatus._id : null : null,
            day: day,
            month: month,
            year: year
        });
        this.age = this.calculateAge(data);
        this.user.features = data.response.features;
    }

    subscribeToProfileCardChanged() {
        this.eventManager.subscribe('profileRegisterInfoModification', (res) => {
            this.userService.findCurrentUserProfile().subscribe((data: any) => {
                this.getProfileCardValueFromBackend(data);
            });
        });
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


    getLocationFromAddress(address) {
        // tslint:disable-next-line:only-arrow-functions
        return new Promise(function (resolve, reject) {
            const geocoder = new google.maps.Geocoder();
            let lat = '';
            let lng = '';
            // tslint:disable-next-line:only-arrow-functions
            geocoder.geocode({'address': address}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
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
        const postCode = this.informationForm.controls.postCode;
        if (postCode.value && postCode.value.length > 0) {
            this.getLocationFromAddress(postCode.value + ' Germany').then(value => {
                postCode.setErrors(null);
                postCode.markAsDirty();
                this.save();
            }).catch(reason => {
                postCode.setErrors({'incorrect': true});
                postCode.markAsDirty();
                return false;
            });
        } else {
            postCode.setErrors({'incorrect': true});
            postCode.markAsDirty();
            return false;
        }

    }
}
