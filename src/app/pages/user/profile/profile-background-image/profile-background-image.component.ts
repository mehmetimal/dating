import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {TokenService} from '../../../../services/token.service';
import {SharedImageService} from '../../../../services/shared-image.service';
import {AcceptStateEnum} from '../../../../model/accept-state.enum';

@Component({
    selector: 'app-profile-background-image',
    templateUrl: './profile-background-image.component.html'
})
export class ProfileBackgroundImageComponent implements OnInit {
    @Input() profileBackgroundImage;
    @Input() profileImage;
    @Input() sharedPersons;

    @Output() backgroundProfileImage$: EventEmitter<any> = new EventEmitter();

    private resourceBackgroundImageUrl = '/user/profile/background/image';

    public loading: boolean;
    public backImageChangedEvent: any = '';
    public backCroppedImage: any = '';
    public backendURL = environment.url;
    public pending = AcceptStateEnum.PENDING;


    @ViewChild('backFileInput', {static: true})
    backFileInputVariable: ElementRef;

    @ViewChild('backgroundImageFileUploader', {static: true}) backgroundImageFileUploader: any;
    backGrounduploader = new FileUploader(
        {
            url: this.resourceBackgroundImageUrl = environment.url + this.resourceBackgroundImageUrl,
            isHTML5: true,
            method: 'POST',
            itemAlias: 'profileBackgroundImage',
            autoUpload: true,
            authTokenHeader: 'authorization',
            authToken: 'Bearer ' + this.userService.getToken(),
            allowedMimeType: ['image/jpeg', 'image/png', 'image/jpg']
        }
    );

    constructor(public userService: UserService,
                private tokenService: TokenService,
                private sharedImageService: SharedImageService) {
    }

    ngOnInit() {
        this.uploaderInit();
    }


    uploaderInit() {
        this.backGrounduploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            this.loading = true;
        };

        this.backGrounduploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            if (response) {
                const data = JSON.parse(response);
                this.profileImage = data.response.profileImage ? data.response.profileImage : null;
                this.profileBackgroundImage = data.response.profileBackgroundImage ? data.response.profileBackgroundImage : null;
                this.backgroundProfileImage$.emit(this.profileBackgroundImage);
                if (this.backgroundImageFileUploader && this.backgroundImageFileUploader.nativeElement) {
                    this.backgroundImageFileUploader.nativeElement.value = '';
                }
            }
        };

        this.backGrounduploader.onCompleteItem = (item: any, response: string, status: number, headers: any): any => {
            this.loading = false;
            const fromUser = this.tokenService.getPayload();
            if (this.profileImage) {
                this.sharedImageService.findAllByImageAndFromUser(fromUser._id, this.profileImage._id).subscribe((value: any) => {
                    this.sharedPersons = value.body.response;
                });
            }

        };
    }

    deleteProfileBackgroundImage() {
        if (this.profileBackgroundImage && this.profileBackgroundImage._id) {
            this.userService.deleteBackgroundProfileImage(this.profileBackgroundImage._id).subscribe(value => {
                this.profileBackgroundImage = null;
                this.backgroundProfileImage$.emit(this.profileBackgroundImage);
            });
        }
    }

    backFileChangeEvent(event) {
        const fileMb = event.currentTarget.files[0].size / 1024 / 1024;
        if (fileMb > 3) {
            alert('Die maximale Dateigröße beträgt 3 MB');
            this.backFileInputVariable.nativeElement.value = '';
            this.backImageChangedEvent = '';
            this.backCroppedImage = '';
        } else {
            this.backImageChangedEvent = event;
        }
    }

    backImageCropped(event) {
        this.backCroppedImage = event.file;
    }

    backSaveImage() {
        this.backGrounduploader.addToQueue([this.backCroppedImage]);
        this.backGrounduploader.uploadAll();
        this.backFileInputVariable.nativeElement.value = '';
        this.backImageChangedEvent = '';
        this.backCroppedImage = '';
    }

}
