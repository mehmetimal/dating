import {Component, ElementRef, EventEmitter, Inject, Injector, Input, OnInit, Output, PLATFORM_ID, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {FileUploader} from 'ng2-file-upload';
import {IImage} from '../../../../model/image.model';
import {IUser} from '../../../../model/user.model';
import {mergeMap} from 'rxjs/operators';
import {AcceptStateEnum} from '../../../../model/accept-state.enum';
import {SharedImage} from '../../../../model/shared-image.model';
import {TokenService} from '../../../../services/token.service';
import {SharedImageService} from '../../../../services/shared-image.service';
import {Socket} from 'ngx-socket-io';
import {isPlatformBrowser} from '@angular/common';
import {JhiEventManager} from '../../../../services/event-manager.service';

@Component({
    selector: 'app-profile-image',
    templateUrl: './profile-image.component.html'
})
export class ProfileImageComponent implements OnInit {
    @Input() profileImage;
    @Input() profileBackgroundImage;
    @Input() sharedPersons;
    @Input() imageGallery;
    @Input() people3input$;
    @Input() people3Loading;
    @Input() people3$;
    @Input() isGalleryProfileImage;
    @Input() defaultProfileImageURL;

    @Output() isGalleryProfileImage$: EventEmitter<any> = new EventEmitter();
    @Output() profileImage$: EventEmitter<any> = new EventEmitter();
    @Output() imageBlur$: EventEmitter<any> = new EventEmitter();

    public croppedImage: any = '';
    public imageChangedEvent: any = '';
    public loading: boolean;
    public selectedPerson: IUser;

    public galleryProfileImage: IImage;

    private resourceUrl = '/user/profile/image';

    public backendURL = environment.url;


    @ViewChild('fileInput', {static: true})
    fileInputVariable: ElementRef;

    @ViewChild('imageFileUploader', {static: true}) imageFileUploader: any;
    uploader = new FileUploader(
        {
            url: this.resourceUrl = environment.url + this.resourceUrl,
            isHTML5: true,
            method: 'POST',
            itemAlias: 'profileImage',
            autoUpload: true,
            authTokenHeader: 'authorization',
            authToken: 'Bearer ' + this.userService.getToken(),
            allowedMimeType: ['image/jpeg', 'image/png', 'image/jpg']
        }
    );

    public approved = AcceptStateEnum.APPROVED;
    public notApproved = AcceptStateEnum.NOTAPPROVED;

    socket: Socket;

    constructor(public userService: UserService,
                private tokenService: TokenService,
                private injector: Injector,
                @Inject(PLATFORM_ID) private platformId: any,
                private sharedImageService: SharedImageService,
                protected eventManager: JhiEventManager) {
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            this.subsribeToImageLikeChanged();
        }
        this.subscribeToModalDialogOpen();
        this.uploaderInit();
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.file;
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    deleteProfileImage() {
        if (this.profileImage && this.profileImage._id) {
            this.userService.deleteProfileImage(this.profileImage._id).subscribe(value => {
                this.profileImage = null;
                this.profileImage$.emit(this.profileImage);
            });
        }
    }

    show(imageBlur) {
        this.userService.userImageBlur(imageBlur).pipe(
            mergeMap((data: any) => {
                this.profileImage = data.data;
                return this.userService.findCurrentUserProfile();
            })
        ).subscribe((data: any) => {
            this.broadCastProfileImageChanged();
            this.eventManager.broadcast({
                name: 'profileGalleryChanged',
                content: data.response
            });
        });
    }

    saveImage(text) {
        if (text === 'croppedImage') {
            this.uploader.addToQueue([this.croppedImage]);
            this.uploader.uploadAll();
            this.fileInputVariable.nativeElement.value = '';
            this.imageChangedEvent = '';
            this.croppedImage = '';
        } else if (text === 'galleryProfileImage') {
            this.userService.updateProfileImage(this.galleryProfileImage._id).pipe(
                mergeMap(data => {
                    this.profileImage = data.result;
                    this.galleryProfileImage = null;
                    return this.userService.findCurrentUserProfile();
                })
            ).subscribe((data: any) => {
                this.broadCastProfileImageChanged();
                this.eventManager.broadcast({
                    name: 'profileGalleryChanged',
                    content: data.response
                });
            });
        }
    }


    uploaderInit() {
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            this.loading = true;
        };

        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            if (response) {
                // this.broadCastProfileImageChanged();
                const data = JSON.parse(response);
                this.profileImage = data.response.profileImage ? data.response.profileImage : null;
                this.profileBackgroundImage = data.response.profileBackgroundImage ? data.response.profileBackgroundImage : null;
                this.profileImage$.emit(this.profileImage);

                if (this.imageFileUploader && this.imageFileUploader.nativeElement) {
                    this.imageFileUploader.nativeElement.value = '';
                }
            }
        };

        this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: any): any => {
            this.loading = false;
            const fromUser = this.tokenService.getPayload();
            if (this.profileImage) {
                this.sharedImageService.findAllByImageAndFromUser(fromUser._id, this.profileImage._id).subscribe((value: any) => {
                    this.sharedPersons = value.body.response;
                });
            }
        };
    }

    updateProfileImage(image) {
        if (image.acceptState === this.approved) {
            this.galleryProfileImage = image;
            if (this.imageFileUploader && this.imageFileUploader.nativeElement) {
                this.imageFileUploader.nativeElement.value = '';
            }
            this.fileInputVariable.nativeElement.value = '';
            this.imageChangedEvent = '';
            this.croppedImage = '';
        }
    }

    unShareProfileImage(selectedPerson: IUser) {
        if (selectedPerson) {
            const sharedImage = new SharedImage();
            sharedImage.image = this.profileImage;
            sharedImage.fromUser = this.tokenService.getPayload();
            sharedImage.toUser = selectedPerson;

            this.sharedImageService.unShareImage(sharedImage).pipe(
                mergeMap((data: any) => {
                    return this.sharedImageService.findAllByImageAndFromUser(sharedImage.fromUser._id, sharedImage.image._id);
                })
            ).subscribe((value: any) => {
                this.sharedPersons = value.body.response;
            });
        }
    }

    shareProfileImage(selectedPerson: IUser) {
        if (selectedPerson) {
            const sharedImage = new SharedImage();
            sharedImage.image = this.profileImage;
            sharedImage.fromUser = this.tokenService.getPayload();
            sharedImage.toUser = selectedPerson;

            this.sharedImageService.shareImage(sharedImage).pipe(
                mergeMap((data: any) => {
                    return this.sharedImageService.findAllByImageAndFromUser(sharedImage.fromUser._id, sharedImage.image._id);
                })
            ).subscribe((value: any) => {
                this.selectedPerson = null;
                this.sharedPersons = value.body.response;
            });
        }
    }

    broadCastProfileImageChanged() {
        this.eventManager.broadcast({
            name: 'profileImageFromGalleryModification',
            content: this.profileImage
        });
    }

    subscribeToModalDialogOpen() {
        this.eventManager.subscribe('profileImageModalOpened', response => {
            this.loading = false;
            this.isGalleryProfileImage = false;
            this.galleryProfileImage = null;
            this.fileInputVariable.nativeElement.value = '';
            this.imageChangedEvent = '';
            this.croppedImage = '';
            const fromUser = this.tokenService.getPayload();
            if (this.profileImage) {
                this.sharedImageService.findAllByImageAndFromUser(fromUser._id, this.profileImage._id).subscribe((value: any) => {
                    this.sharedPersons = value.body.response;
                });
            }
        });
    }

    subsribeToImageLikeChanged() {
        this.socket.on('profile-image-like', (data) => {
            if (this.galleryProfileImage && data._id === this.galleryProfileImage._id) {
                this.galleryProfileImage.totalLikes = data.totalLikes;
            }

            if (this.profileImage && this.profileImage._id === data._id) {
                this.profileImage.totalLikes = data.totalLikes;
            }
        });
    }
}
