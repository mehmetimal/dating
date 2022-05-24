import {Component, ElementRef, Inject, Injector, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../../../environments/environment';
import {UserService} from '../../../../services/user.service';
import {IUser} from '../../../../model/user.model';
import {AcceptStateEnum} from '../../../../model/accept-state.enum';
import {mergeMap} from 'rxjs/operators';
import {GalleryService} from '../../../../services/gallery.service';
import {IImage} from '../../../../model/image.model';
import {SharedImage} from '../../../../model/shared-image.model';
import {TokenService} from '../../../../services/token.service';
import {SharedImageService} from '../../../../services/shared-image.service';
import {Socket} from 'ngx-socket-io';
import {isPlatformBrowser} from '@angular/common';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {UserRecentTransactionType} from "../../../../model/user-recent-transaction-type.enum";
import {UserRecentTransaction} from "../../../../model/user-recent-transaction.model";
import {UserRecentTransactionService} from "../../../../services/user-recent-transaction.service";

@Component({
    selector: 'app-image-gallery',
    templateUrl: './image-gallery.component.html'
})
export class ImageGalleryComponent implements OnInit {
    public sharedPersons;
    public selectedPerson: IUser;
    @Input() people3input$;
    @Input() people3Loading;
    @Input() people3$;
    @Input() imageGallery: IImage[];
    @Input() profileImage;
    public approved = AcceptStateEnum.APPROVED;
    public notApproved = AcceptStateEnum.NOTAPPROVED;
    public selectedImageBlur;
    imageChangedEvent: any = '';
    croppedImage: any = '';
    public isProfile: boolean;

    @ViewChild('fileInput', {static: true})
    fileInputVariable: ElementRef;

    @ViewChild('galleryModal', {static: true}) myModal: ElementRef;

    private resourceGalleryUrl = '/user/profile/gallery';

    loading = false;

    public backendURL = environment.url;

    public selectedImageFromGallery: IImage;
    public pending = AcceptStateEnum.PENDING;

    socket: Socket;

    @ViewChild('galleryFileUploader', {static: true}) galleryFileUploader: any;
    uploader = new FileUploader(
        {
            url: this.resourceGalleryUrl = environment.url + this.resourceGalleryUrl,
            isHTML5: true,
            method: 'POST',
            itemAlias: 'galleryImage',
            autoUpload: true,
            authTokenHeader: 'authorization',
            authToken: 'Bearer ' + this.userService.getToken(),
            allowedMimeType: ['image/jpeg', 'image/png', 'image/jpg']
        }
    );

    constructor(public userService: UserService,
                private tokenService: TokenService,
                private galleryService: GalleryService,
                private sharedImageService: SharedImageService,
                private eventManager: JhiEventManager,
                private injector: Injector,
                private userRecentTransactionService: UserRecentTransactionService,
                @Inject(PLATFORM_ID) private platformId: any) {

    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            // this.subsribeToImageLikeChanged();
        }
        this.registerGalleryModalDialogOpenChanged();
        this.uploaderInit();
    }

    fileChangeEvent(event: any): void {
        this.selectedImageFromGallery = null;
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.file;
    }

    show(imageBlur) {
        const blur = imageBlur ? false : true;
        this.userService.galleryImageBlurById(this.selectedImageFromGallery._id, blur).pipe(
            mergeMap(value => this.userService.findCurrentUserProfile())
        ).subscribe((data: any) => {
            this.selectedImageBlur = !blur;
            this.eventManager.broadcast({
                name: 'profileGalleryChanged',
                content: data.response
            });
            this.broadCastProfileImageChanged(data.response.profileImage);
        });
    }

    saveImage() {
        // save image
        this.uploader.addToQueue([this.croppedImage]);
        this.uploader.uploadAll();
        this.fileInputVariable.nativeElement.value = '';
        this.imageChangedEvent = '';
        this.croppedImage = '';
        this.selectedImageFromGallery = null;
        this.sharedPersons = null;
        this.selectedPerson = null;
    }

    uploaderInit() {
        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('isProfile', this.isProfile + '');
        };
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
            this.loading = true;
            this.selectedImageFromGallery = null;
        };

        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
            if (response) {
                // console.log(response);
                this.eventManager.broadcast({
                    name: 'profileGalleryChanged',
                    content: JSON.parse(response)
                });
                if (this.galleryFileUploader && this.galleryFileUploader.nativeElement) {
                    this.galleryFileUploader.nativeElement.value = '';
                }
            }
        };

        this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: any): any => {
            this.loading = false;
            const element = document.getElementById('exampleModalScrollableOne');
            element.click();
        };
    }

    registerGalleryModalDialogOpenChanged() {
        this.eventManager
            .subscribe('gallery-modal-dialog-open', response => {
                if (!response.content.image) {
                    if (this.galleryFileUploader && this.galleryFileUploader.nativeElement) {
                        this.galleryFileUploader.nativeElement.value = '';
                    }
                    this.fileInputVariable.nativeElement.value = '';
                    this.imageChangedEvent = '';
                    this.croppedImage = '';
                    this.selectedImageFromGallery = null;
                    this.sharedPersons = null;
                    this.selectedPerson = null;
                    this.isProfile = response.content.isProfile;
                } else {
                    this.isProfile = response.content.isProfile;
                    this.selectImageFromGallery(response.content.image);
                }

            });
    }

    // This code snipped comes from profile


    unShareImage(selectedPerson: IUser) {
        const sharedImage = new SharedImage();
        sharedImage.image = this.selectedImageFromGallery;
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

    shareImage(selectedPerson: IUser) {
        const sharedImage = new SharedImage();
        sharedImage.image = this.selectedImageFromGallery;
        sharedImage.fromUser = this.tokenService.getPayload();
        sharedImage.toUser = selectedPerson;

        const shareImageTransaction = UserRecentTransactionType.SHAREIMAGE;
        const userRecentTransaction = new UserRecentTransaction();
        userRecentTransaction.fromUser = this.tokenService.getPayload();
        userRecentTransaction.user = selectedPerson;
        userRecentTransaction.type = shareImageTransaction;

        this.sharedImageService.shareImage(sharedImage).pipe(
            mergeMap((data: any) => {
                return this.sharedImageService.findAllByImageAndFromUser(sharedImage.fromUser._id, sharedImage.image._id);
            }),
            mergeMap((value: any) => {
                this.selectedPerson = null;
                this.sharedPersons = value.body.response;
                return this.userRecentTransactionService.create(userRecentTransaction);
            })
        ).subscribe((value: any) => {
        });
    }

    deleteGalleryImageById() {
        const image: any = this.selectedImageFromGallery;
        this.galleryService.deleteGalleryImageById(image._id).pipe(
            mergeMap(value => this.userService.findCurrentUserProfile())
        ).subscribe((data: any) => {
            this.selectedImageFromGallery = null;
            this.sharedPersons = null;
            this.selectedPerson = null;
            this.eventManager.broadcast({
                name: 'profileGalleryChanged',
                content: data.response
            });
            const profileImageDeleted = data.response ? data.response.gallery
                ? data.response.gallery.images
                    ? data.response.gallery.images.filter(value => value && value.isProfile)[0] : null : null : null;
            this.broadCastProfileImageChanged(profileImageDeleted);
        });
    }

    selectImageFromGallery(image: any) {
        this.sharedPersons = null;
        this.selectedPerson = null;
        this.fileInputVariable.nativeElement.value = '';
        this.imageChangedEvent = '';
        this.croppedImage = '';
        this.selectedImageFromGallery = image;
        this.selectedImageBlur = this.selectedImageFromGallery.isBlurRemoved ? false : true;
        const currentUser = this.tokenService.getPayload();
        this.sharedImageService.findAllByImageAndFromUser(currentUser._id, image._id).subscribe((value: any) => {
            this.sharedPersons = value.body.response;
        });
    }

    updateProfileImageFromSelectedGalleryImage() {
        this.userService.updateProfileImage(this.selectedImageFromGallery._id).pipe(
            mergeMap(value => this.userService.findCurrentUserProfile())
        ).subscribe((data: any) => {
            // this.selectedImageFromGallery = null;
            const profileImage = data.response ? data.response.gallery
                ? data.response.gallery.images
                    ? data.response.gallery.images.filter(value => value && value.isProfile)[0] : null : null : null;
            this.profileImage = profileImage;
            this.eventManager.broadcast({
                name: 'profileGalleryChanged',
                content: data.response
            });
            this.broadCastProfileImageChanged(this.profileImage);
        });
    }

    broadCastProfileImageChanged(content) {
        this.eventManager.broadcast({
            name: 'profileImageFromGalleryModification',
            content
        });
    }

    subsribeToImageLikeChanged() {
        this.socket.on('profile-image-like', (data) => {
            if (this.selectedImageFromGallery && data._id === this.selectedImageFromGallery._id) {
                this.selectedImageFromGallery.totalLikes = data.totalLikes;
            }

            if (this.profileImage && this.profileImage._id === data._id) {
                this.profileImage.totalLikes = data.totalLikes;
            }
        });
    }

    checkProfileImage(image: IImage) {
        const profileImage = this.imageGallery.find(value => value && value.isProfile);
        return profileImage ? profileImage._id === image._id ? true : false : false;
    }
}
