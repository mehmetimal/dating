import {Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {catchError, debounceTime, distinctUntilChanged, mergeMap, switchMap, tap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {IUser, User} from '../../../model/user.model';
import {concat, Observable, of, Subject, Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {IImage} from '../../../model/image.model';
import {GalleryService} from '../../../services/gallery.service';
import {LocalStorageService} from 'ngx-webstorage';
import {Socket} from 'ngx-socket-io';
import {isPlatformBrowser} from '@angular/common';
import {MessageService} from '../../../services/message.service';
import {IProfileVisitors} from '../../../model/profile-visitors.model';
import {TokenService} from '../../../services/token.service';
import {IFavoriteUser} from '../../../model/favorite-user.model';
import {Router} from '@angular/router';
import {MessageUtilService} from '../../../services/message-util.service';
import {SharedImageService} from '../../../services/shared-image.service';
import {IUserFeature} from '../../../model/user-feature.model';
import {UserFeatureService} from '../../../services/user-feature.service';
import {AcceptStateEnum} from '../../../model/accept-state.enum';
import {JhiEventManager} from '../../../services/event-manager.service';
import {UdcService} from '../../../services/udc.service';
import {UdcNameEnum} from '../../../model/udc-name.enum';
import {VipErrorModalComponent} from '../messages/vip-error-modal.component';
import {LoadingModalComponent} from '../../register/loading-modal.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, OnDestroy {
    public udcFolder = environment.udcFolder;
    public loading = false;

    public imageGallery = [];
    public isGalleryProfileImage: boolean;

    public people3$: Observable<User[]>;
    public people3Loading = false;
    public people3input$ = new Subject<string>();

    public backendURL = environment.url;

    public profileImage: IImage;
    public profileBackgroundImage: IImage;
    public profileName: any;

    public clubNumber: any;
    public about: string;
    public status: string;
    public sharedPersons: IUser[];

    public profileVisitors: IProfileVisitors[];
    public favoriteUser: IFavoriteUser[];

    public data: any;

    registerInfoEventSubscriber: Subscription;
    profileImageEventSubscriber: Subscription;
    initializeProfileInformationSubs: Subscription;

    randomEmptyImage: number;

    socket: Socket;

    totalLikes: number;

    messageCount: number;
    totalLikeCount: number;

    public features;
    featureOptions: IUserFeature[];

    public approved = AcceptStateEnum.APPROVED;

    public defaultProfileImageUrl: string;
    public profileTitelBildUrl: string;

    public vipErrorModalCheckbox = false;

    constructor(
        private injector: Injector,
        public userService: UserService,
        private tokenService: TokenService,
        protected eventManager: JhiEventManager,
        private galleryService: GalleryService,
        private messageService: MessageService,
        private localstorage: LocalStorageService,
        private router: Router,
        private sharedImageService: SharedImageService,
        private messageUtilService: MessageUtilService,
        private userFeatureService: UserFeatureService,
        private udcService: UdcService,
        private localStorageService: LocalStorageService,
        @Inject(PLATFORM_ID) private platformId: any,
        private modalService: NgbModal) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnInit() {
        this.loadingModal();
        this.loading = false;
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            this.subsribeToProfileImageLikeChanged();
        }
        this.adjustProfileEmptyImage();
        this.loadPeople3();
        this.registerGalleryChanged();
        this.initializeProfilePage();
        this.registerChangeInProfileImage();
        this.registerChangeInProfileImageFromGallery();
        this.eventManager.subscribe('vip-modal-change-page', (data) => {
            console.log(data);
            if (data && data.content && data.content.profile) {
                document.getElementById('closeBildergalerieModal').click();
            }
            if (data && data.content && data.content.isProfileBackground) {
                document.getElementById('closeBildergalerieBackgroundModal').click();
            }
        });
        this.eventManager.subscribe('change-vip-error-modal-checkbox', (data) => {
            this.vipErrorModalCheckbox = data.content;
        });
    }

    adjustProfileEmptyImage() {
        const emptyImageIsExist = this.localstorage.retrieve('profile-empty-image');
        if (!emptyImageIsExist) {
            this.randomEmptyImage = Math.floor(Math.random() * 3) + 1;
            this.localstorage.store('profile-empty-image', this.randomEmptyImage);
        } else {
            this.randomEmptyImage = this.localstorage.retrieve('profile-empty-image');
        }
    }

    ngOnDestroy(): void {
        if (this.profileImageEventSubscriber) {
            this.eventManager.destroy(this.profileImageEventSubscriber);
        }
        if (this.registerInfoEventSubscriber) {
            this.eventManager.destroy(this.registerInfoEventSubscriber);
        }
        if (this.modalService.hasOpenModals()) {
            this.modalService.dismissAll();
        }
        if (this.initializeProfileInformationSubs) {
            this.initializeProfileInformationSubs.unsubscribe();
        }
    }

    initializeProfilePage() {
        this.profileImage = null;
        this.about = null;
        this.status = null;
        this.initializeProfileInformation();
    }


    initializeProfileInformation() {
        this.initializeProfileInformationSubs = this.messageService.countOfCurrentUserAllMessage().pipe(
            mergeMap((messages: any) => {
                const result = messages.body && messages.body.response ? messages.body.response : 0;
                this.messageCount = result;
                return this.userService.countOfCurrentUserGetLikes();
            }),
            mergeMap((count: any) => {
                const result = count.body && count.body.response ? count.body.response : 0;
                this.totalLikeCount = result;
                return this.userFeatureService.findAll();
            }),
            mergeMap((data: any) => {
                this.featureOptions = data.body.response;
                return this.userService.findCurrentUserProfile();
            }),
            mergeMap((data: any) => {
                this.initailizeProfileFormFromBackend(data);
                return this.udcService.findAll();
            }),
            mergeMap((data: any) => {
                const genderName = this.data.response.gender.name;
                const udc = data.body ? data.body.response : [];
                this.adjustDefaultProfileImageAndTitelBild(udc, genderName);
                const currentUser = this.tokenService.getPayload();
                if (this.profileImage) {
                    return this.sharedImageService.findAllByImageAndFromUser(currentUser._id, this.profileImage._id);
                } else {
                    return of(null);
                }
            })
        ).subscribe((data: any) => {
            if (data) {
                this.sharedPersons = data.body.response;
            } else {
                this.sharedPersons = [];
            }

            this.loading = true;
            this.closeAllModal();

        });

    }

    initailizeProfileFormFromBackend(data) {
        this.data = data;

        if (data.response && data.response.gallery) {
            this.imageGallery = data.response.gallery.images;
            this.profileImage = this.imageGallery ? this.imageGallery.filter(value => value && value.isProfile === true)[0]
                ? this.imageGallery.filter(value => value && value.isProfile === true)[0] : null : null;
        } else {
            this.imageGallery = [];
        }

        if (data.response && data.response.about) {
            this.about = data.response.about;
        }

        if (data.response && data.response.status) {
            this.status = data.response.status;
        }

        if (data.response && data.response.isGalleryProfileImage) {
            this.isGalleryProfileImage = data.response.isGalleryProfileImage;
        }

        if (data.response && data.response.profileBackgroundImage) {
            this.profileBackgroundImage = data.response.profileBackgroundImage;
        }

        if (data.response && data.response.profileName) {
            this.profileName = data.response.profileName;
        }

        if (data.response && data.response.features) {
            this.features = data.response.features;
        }
    }


    registerChangeInProfileImage() {
        this.profileImageEventSubscriber = this.eventManager
            .subscribe('profileImageModification', response => this.getCurrentUserProfileImage());
    }

    registerChangeInProfileImageFromGallery() {
        this.profileImageEventSubscriber = this.eventManager
            .subscribe('profileImageFromGalleryModification', response => {
                this.profileImage = response.content;
            });
    }

    getCurrentUserProfileImage() {
        const currentUser = this.tokenService.getPayload();
        this.sharedImageService.findAllByImageAndFromUser(currentUser._id, this.profileImage._id).pipe(
            mergeMap((data: any) => {
                this.sharedPersons = data.body.response;
                return this.userService.findCurrentUserProfile();
            })
        ).subscribe((data: any) => {
            this.profileImage = data.response.profileImage ? data.response.profileImage : null;
            this.totalLikes = this.profileImage.totalLikes;
            this.profileBackgroundImage = data.response.profileBackgroundImage ? data.response.profileBackgroundImage : null;
        });
    }

    private loadPeople3() {
        this.people3$ = concat(
            of([]), // default items
            this.people3input$.pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => this.people3Loading = true),
                switchMap(term => this.userService.getAllUsersByStartWithClubNumber(term).pipe(
                    catchError(() => of([])), // empty list on error
                    tap(() => this.people3Loading = false)
                ))
            )
        );
    }

    registerGalleryChanged() {
        this.registerInfoEventSubscriber = this.eventManager
            .subscribe('profileGalleryChanged', response => this.afterProfileGalleryChanged(response));
    }

    afterProfileGalleryChanged(response) {
        if (response && response.content && response.content.galleryPersist && response.content.galleryPersist.images) {
            this.imageGallery = response.content.galleryPersist.images;
        } else if (response && response.content && response.content.gallery && response.content.gallery.images) {
            this.imageGallery = response.content.gallery.images;
        } else {
            this.imageGallery = [];
        }
    }

    backgroundProfileImageUpdate$(event) {
        this.profileBackgroundImage = event;
    }

    subsribeToProfileImageLikeChanged() {
        this.socket.on('profile-image-like', (data) => {
            this.userService.findCurrentUserProfile().subscribe(res => this.initailizeProfileFormFromBackend(res));
        });
    }

    broadCastGalleryModalDialogOpenChanged() {
        const currentUser = this.tokenService.getPayload();
        if (!this.localStorageService.retrieve(currentUser._id + 'isProfileModalShow')) {
            const content = 'willkommen in deiner Bildergalerie! Hier kannst du 5 Bilder von dir hochladen. Bitte beachte, dass die Bilder nachdem Hochladen erst vom Support geprüft und freigeschalten werden müssen. Bis dein Bild freigegeben wurde, kannst nur du es sehen. Nach der Freischaltung kannst du jedes Bild zum Profilbild ernennen und auch für andere User die Verpixelung entfernen.';
            const modalRef = this.modalService.open(VipErrorModalComponent, {
                centered: true,
                backdropClass: 'vip-error-modal-header-margin',
                windowClass: 'vip-error-modal-header-margin vip-error-modal-background-color'
            });
            modalRef.componentInstance.name = currentUser.profileName;
            modalRef.componentInstance.content = content;
            modalRef.componentInstance.isClose = true;
            modalRef.componentInstance.isUrl = true;
            modalRef.componentInstance.urlText = 'Hilfe zur Verpixelung';
            modalRef.componentInstance.url = 'Anleitungen';
            modalRef.componentInstance.isCheckbox = true;
            modalRef.componentInstance.isLightBackground = true;
            modalRef.componentInstance.isPriseButton = false;
            modalRef.componentInstance.isBackButton = false;
            modalRef.componentInstance.isProfile = true;
            modalRef.result.then(() => {
            }, (result) => {
                this.localStorageService.store(currentUser._id + 'isProfileModalShow', this.vipErrorModalCheckbox);
                this.vipErrorModalCheckbox = false;
            });
        }
    }

    initializeProfileImageDialog() {
        this.broadCastGalleryModalDialogOpenChanged();

        this.eventManager.broadcast({
            name: 'gallery-modal-dialog-open',
            content: {
                isProfile: true,
                image: this.profileImage
            }
        });
    }

    adjustDefaultProfileImageAndTitelBild(udc, genderName) {
        const titelbild = udc.filter(val => val.name && val.name.name === UdcNameEnum.Profilseiten_Defaulttitelbild1_all_1920x350)[0];
        if (titelbild) {
            this.profileTitelBildUrl = this.backendURL + titelbild.image.imageURL;
        }
        if (genderName === 'Male') {
            const randomNumber = this.data.response.randomNumber;
            if (randomNumber === 1) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild1_Gentleman_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 2) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild2_Gentleman_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 3) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild3_Gentleman_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }
            }
        } else if (genderName === 'Female') {
            const randomNumber = this.data.response.randomNumber;
            if (randomNumber === 1) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild1_Lady_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 2) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild2_Lady_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 3) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild3_Lady_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }
            }
        } else if (genderName === 'Couple') {
            const randomNumber = this.data.response.randomNumber;
            if (randomNumber === 1) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild1_Lovers_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 2) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild2_Lovers_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }

            } else if (randomNumber === 3) {
                const image = udc.filter(val => val.name && val.name.name
                    === UdcNameEnum.Profilseiten_Defaultsilhouettenbild3_Lovers_320x320)[0];
                if (image) {
                    this.defaultProfileImageUrl = this.backendURL + image.image.imageURL;
                }
            }
        }
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

    openBackgroundModal() {
        const currentUser = this.tokenService.getPayload();
        if (!this.localStorageService.retrieve(currentUser._id + 'isProfileBackgroundImageModalShow')) {
            const content = 'dein neues Titelbild wird vom Support überprüft. Erst nach Freigabe wird es in deinem Profil angezeigt. Bitte hab etwas Geduld bis die Prüfung abgeschlossen ist.';
            const modalRef = this.modalService.open(VipErrorModalComponent, {
                centered: true,
                backdropClass: 'vip-error-modal-header-margin',
                windowClass: 'vip-error-modal-header-margin vip-error-modal-background-color'
            });
            modalRef.componentInstance.name = currentUser.profileName;
            modalRef.componentInstance.content = content;
            modalRef.componentInstance.isClose = true;
            modalRef.componentInstance.isUrl = true;
            modalRef.componentInstance.urlText = 'Hilfe zum Titelbild';
            modalRef.componentInstance.url = 'Anleitungen';
            modalRef.componentInstance.isCheckbox = true;
            modalRef.componentInstance.isLightBackground = true;
            modalRef.componentInstance.isPriseButton = false;
            modalRef.componentInstance.isBackButton = false;
            modalRef.componentInstance.isProfileBackground = true;
            modalRef.result.then(() => {
            }, (result) => {
                this.localStorageService.store(currentUser._id + 'isProfileBackgroundImageModalShow', this.vipErrorModalCheckbox);
                this.vipErrorModalCheckbox = false;
            });
        }
    }
}
