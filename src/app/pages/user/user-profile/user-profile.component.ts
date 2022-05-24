import {AfterViewInit, Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';

import {UserService} from '../../../services/user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {MessageService} from '../../../services/message.service';
import {TokenService} from '../../../services/token.service';
import {Socket} from 'ngx-socket-io';
import {from, Observable, of, Subscription} from 'rxjs';
import {HobbyAnswerType} from '../../../model/hobby-answer-type.enum';
import {isPlatformBrowser} from '@angular/common';
import {ImageService} from '../../../services/image.service';
import {LocalStorageService} from 'ngx-webstorage';
import {IUser} from '../../../model/user.model';
import {IImage} from '../../../model/image.model';
import {distinct, filter, mergeMap, toArray} from 'rxjs/operators';
import {AcceptStateEnum} from '../../../model/accept-state.enum';
import {PostService} from '../../../services/post.service';
import {IPost} from '../../../model/post.model';
import {IFavoriteUser} from '../../../model/favorite-user.model';
import {SharedImageService} from '../../../services/shared-image.service';
import {SystemConfigService} from '../../../services/system-config.service';
import {IUserFeature} from '../../../model/user-feature.model';
import {UserFeatureService} from '../../../services/user-feature.service';
import {JhiEventManager} from '../../../services/event-manager.service';
import {UserRecentTransaction} from '../../../model/user-recent-transaction.model';
import {UserRecentTransactionService} from '../../../services/user-recent-transaction.service';
import {UserRecentTransactionType} from '../../../model/user-recent-transaction-type.enum';
import {HttpResponse} from '@angular/common/http';
import {ReportType} from '../../../model/report-type.enum';
import {ReportService} from '../../../services/report.service';
import {Report} from '../../../model/report.model';
import {SharedAllImageConditionService} from '../../../services/shared-all-image-condition.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy, AfterViewInit {
    public udcFolder = environment.udcFolder;
    public JA = HobbyAnswerType.JA;
    public NEIN = HobbyAnswerType.NEIN;
    public VIELLEICHT = HobbyAnswerType.VIELLEICHT;
    public VIDEOCHATZEIGEN = HobbyAnswerType.VIDEOCHATZEIGEN;
    public KEINEANGABE = HobbyAnswerType.KEINEANGABE;
    public isPossibleLikeImage = true;

    public approved = AcceptStateEnum.APPROVED;
    public profileUserPosts: IPost[];

    public isGameActive = false;

    public profileImageUrl: Observable<HttpResponse<IImage>>;
    public profileImageBlurUrl: Observable<HttpResponse<IImage>>;

    public visit = {
        isProfile: false,
        isPlay: false,
        isLike: false
    };

    isProfileVisit = false;
    randomEmptyImage: number;

    profileBackgroundImage = false;
    profileName: any;
    imageGallery?: any = [];
    user: any;
    age: any;
    socket: Socket;

    public backendURL = environment.url;
    public hobbiesChangedSubscriber: Subscription;
    public profileUserIsOnline = false;
    public isMerkenBefore;
    public favoriteUser: IFavoriteUser;

    public sharedGalleryImagesWithMe: [];
    public sharedImagesWithCurrentUser: any[] = [];
    public featureOptions: IUserFeature[];

    public image: IImage;

    public readMore = false;
    public readMoreStatus = false;

    public statusReport = ReportType.STATUS;
    public aboutReport = ReportType.UBERMICH;
    public messageReport = ReportType.NACHRICHTEN;

    public isSharedAllImageCondition = false;

    public isStatusReportAvailable = true;
    public isAboutReportAvailable = true;

    public blockUserList: any;

    constructor(
        private injector: Injector,
        public userService: UserService,
        public imageService: ImageService,
        private route: ActivatedRoute,
        private postService: PostService,
        private router: Router,
        private messageService: MessageService,
        private tokenService: TokenService,
        private eventManager: JhiEventManager,
        private localstorage: LocalStorageService,
        private sharedImageService: SharedImageService,
        private systemConfigService: SystemConfigService,
        private userFeatureService: UserFeatureService,
        private reportService: ReportService,
        private userRecentTransactionService: UserRecentTransactionService,
        private sharedAllImageConditionService: SharedAllImageConditionService,
        public modalService: NgbModal,
        @Inject(PLATFORM_ID) private platformId: any
    ) {

    }

    ngOnInit() {
        this.isGameActive = false;
        if (isPlatformBrowser(this.platformId)) {
            this.route.paramMap.subscribe((params: ParamMap) => {
                this.profileName = params.get('profileName');
                this.updateViewCount(this.profileName);
            });
            this.getAllUser(false);
            this.socket = this.injector.get<Socket>(Socket);
            this.subsribeToUserProfileChanged();
            this.adjustProfileEmptyImage();
        }
    }

    openBlockListModal(modal) {
        this.modalService.open(modal, {centered: true});
    }

    updateViewCount(profileName) {
        let user;
        this.systemConfigService.findAll().pipe(
            mergeMap((data: any) => {
                this.isGameActive = data.body[0].isGameActive;
                return this.userFeatureService.findAll();
            }),
            mergeMap((data: any) => {
                this.featureOptions = data.body.response;
                return this.userService.getUserDetail(profileName);
            }),
            mergeMap(data => {
                user = data && data.data ? data.data : null;
                if (user.profileImage) {
                    this.profileImageUrl = this.imageService.findById(user.profileImage._id, false);
                    this.profileImageBlurUrl = this.imageService.findById(user.profileImage._id, true);
                }
                return this.postService.findPostByUserId(user._id);
            }),
            mergeMap((data: any) => {
                const profileUserPostsVar = data && data.body ? data.body.response : [];
                this.profileUserPosts = profileUserPostsVar.filter(post => post.isActive === true);
                return this.userService.updateViewCount(user._id);
            }),
            mergeMap(data => {
                const currentUser = this.tokenService.getPayload();
                const viewProile = UserRecentTransactionType.VIEWPROFILE;
                const userRecentTransaction = new UserRecentTransaction();
                userRecentTransaction.fromUser = currentUser;
                userRecentTransaction.user = user;
                userRecentTransaction.type = viewProile;
                return this.userRecentTransactionService.create(userRecentTransaction);
            }),
            mergeMap(data => {
                return this.sharedImageService.findAllSharedImagesWithCurrentUser();
            })
        ).subscribe((res) => {
            this.sharedImagesWithCurrentUser = res.body;
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


    getAllUser(isSocketCall = false, isLikedImageCall = false) {
        this.userService.getUserDetail(this.profileName).pipe(
            mergeMap((data: any) => {
                this.user = data.data;
                if (this.user.deleted) {
                    this.router.navigateByUrl('/');
                }
                if (this.user.profileImage) {
                    this.profileImageUrl = this.imageService.findById(this.user.profileImage._id, false);
                    this.profileImageBlurUrl = this.imageService.findById(this.user.profileImage._id, true);
                }
                this.socket.emit('usersOnline', {
                    room: 'global'
                });
                this.isProfileVisitFuncs();
                if (this.user == null) {
                    this.router.navigateByUrl('/');
                } else {
                    // Age
                    if (this.user.birthday) {
                        this.age = this.user.birthday;
                    }

                    if (!isLikedImageCall) {
                        this.image = this.user.profileImage;
                    }
                    if (this.image) {
                        if (isSocketCall) {
                            this.socket.emit('profile-image-like', this.image);
                        }
                    }
                    if (this.user.profileBackgroundImage) {
                        this.profileBackgroundImage = true;
                    }
                    if (this.user.gallery) {
                        this.imageGallery = this.user.gallery.images;
                    }

                    if (!isSocketCall && this.isProfileVisit) {
                        this.visit = {
                            isLike: false,
                            isProfile: true,
                            isPlay: false
                        };
                        return this.userService.profileVisitorsUpdate(this.visit, this.user);

                    } else {
                        return of(null);
                    }
                }
            }), mergeMap(data => {
                if (!isSocketCall && !this.isProfileVisit) {
                    return this.userService.profileVisitors(this.user);
                } else {
                    return of(null);
                }
            })
        ).subscribe(data => {
            if (isSocketCall) {
                if (!this.isProfileVisit) {
                    this.profileVisitors();
                }
                if (this.isProfileVisit) {
                    this.visit = {
                        isLike: true,
                        isProfile: false,
                        isPlay: false
                    };
                    this.profileVisitorsUpdate(this.visit);
                }
            }
            this.getCurrentUserInfo();
            this.sharedAllImageCondition(this.user);
            this.findByTypeAndReportedUser();
        });
    }

    isProfileVisitFuncs() {
        const currentUserId = this.tokenService.getPayload()._id;
        if (this.user) {
            this.user.profileVisitors.forEach((result) => {
                if (result.userId === currentUserId) {
                    this.isProfileVisit = true;
                }
            });
        }

    }

    profileVisitors() {
        this.userService.profileVisitors(this.user).subscribe((data) => {

        }, (err) => {

        });
    }

    profileVisitorsUpdate(updateData) {
        this.userService.profileVisitorsUpdate(updateData, this.user).subscribe((data) => {
        });
    }

    sendMessageToAnotherUser(param) {
        if (this.userService.isCurrentUserHasRole('ROLE_PREMIUM') && this.isGameActive) {
            const currentUser = this.tokenService.getPayload();
            const message = 'SYSTEMQUESTIONHOBBYANSWER' + param;
            this.messageService
                .store(currentUser._id, this.user._id, this.user.profileName, message)
                .subscribe(() => {
                    this.message();
                    this.socket.emit('refresh', {receiver: this.user, sender: currentUser});
                });
        }
    }


    message() {
        this.visit = {
            isLike: false,
            isProfile: false,
            isPlay: true
        };
        this.profileVisitorsUpdate(this.visit);
    }

    subsribeToUserProfileChanged() {
        this.socket.on('hobbiesChangedEventListener', () => {
            this.getAllUser(false);
        });
    }

    likeImage(image: any) {
        if (this.isPossibleLikeImage) {
            this.isPossibleLikeImage = false;
            this.imageService.likeProfileImage(image._id).subscribe((data: any) => {
                this.image = data.result;
                this.getAllUser(true, true);
                this.isPossibleLikeImage = true;
                const currentUser = this.tokenService.getPayload();
                const viewProile = UserRecentTransactionType.LIKEIMAGE;
                const userRecentTransaction = new UserRecentTransaction();
                userRecentTransaction.fromUser = currentUser;
                userRecentTransaction.user = this.user;
                userRecentTransaction.type = viewProile;
                this.userRecentTransactionService.create(userRecentTransaction).subscribe();
            }, error => {
                if (error.status === 422) {
                    this.imageService.unLikeProfileImage(image._id).subscribe((data: any) => {
                        this.image = data.result;
                        this.getAllUser(true, true);
                        this.isPossibleLikeImage = true;
                    });
                } else if (error.status === 500) {
                    location.reload();
                    this.isPossibleLikeImage = true;
                }
            });
        }
    }

    isCurrentUserBlockList(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let blockListUser;
        if (user && user.blockUserList && user.blockUserList.length > 0) {
            blockListUser = user.blockUserList.find(value => value && value._id === currentUser._id);
        }
        return blockListUser ? true : false;
    }

    isSharedProfileImageWithCurrentUser(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let sharedUser;
        if (this.sharedImagesWithCurrentUser && this.sharedImagesWithCurrentUser.length > 0) {
            sharedUser = this.sharedImagesWithCurrentUser.find(value => value.toUser === currentUser._id
                && (user && user.profileImage && value.image === user.profileImage._id));
        }
        return sharedUser || (user && user.profileImage && user.profileImage.isBlurRemoved) ? true : false;
    }

    ngOnDestroy() {
        if (this.hobbiesChangedSubscriber) {
            this.eventManager.destroy(this.hobbiesChangedSubscriber);
        }
        if (this.socket) {
            this.socket.removeAllListeners('profile-image-like');
            this.socket.removeAllListeners('refresh');
        }
    }

    public get sortedArray(): IImage[] {
        const imageGalleryFiltered = this.imageGallery;
        return imageGalleryFiltered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }

    ngAfterViewInit(): void {
        const currentUser = this.tokenService.getPayload();
        if (isPlatformBrowser(this.platformId)) {
            this.socket.on('usersOnline', data => {
                from(data)
                    .pipe(
                        distinct((value: IUser) => value._id),
                        filter(value => value._id !== currentUser._id),
                        toArray()
                    ).subscribe((res: any[]) => {
                    this.profileUserIsOnline = res.filter(value => this.user && value && value._id === this.user._id).length > 0
                        ? true : false;
                });
            });
        }
    }

    getCurrentUserInfo() {
        this.sharedGalleryImagesWithMe = [];
        this.userService.findCurrentUserProfile().subscribe((value: any) => {
            const user = value.response;
            if (user.blockUserList) {
                this.blockUserList = user.blockUserList;
                console.log(this.blockUserList);
            }
            if (user.favoriteUser) {
                this.isMerkenBefore = false;
                user.favoriteUser.forEach(response => {
                    if (response.user && (response.user._id === this.user._id)) {
                        this.isMerkenBefore = true;
                        this.favoriteUser = response;
                    }
                });
            } else {
                this.isMerkenBefore = false;
            }
            this.sharedImageService.findImageSharedToUser(this.user._id).subscribe((images: any) => {
                this.sharedGalleryImagesWithMe = images.body;
            });
        });
    }

    favoriteUserAdded() {
        this.userService.favoriteUser(this.user).subscribe((data) => {
            this.getCurrentUserInfo();
        });
    }

    favoriteUserDelete() {
        this.userService.favoriteUserDelete(this.favoriteUser).subscribe((data) => {
            this.getCurrentUserInfo();
        });
    }

    goToMessage() {
        const convertUser = JSON.stringify(this.user);
        this.router.navigateByUrl('/messages', {state: {data: convertUser}});
    }

    isImageSharedWithMe(image: IImage) {
        if (image.isBlurRemoved) {
            return true;
        } else {
            if (this.sharedGalleryImagesWithMe && this.sharedGalleryImagesWithMe.length > 0) {
                const arr = this.sharedGalleryImagesWithMe.filter((value: any) => value.image === image._id);
                return arr.length > 0 ? true : false;
            } else {
                return false;
            }
        }
    }

    selectImageFromGallery(image: IImage) {
        if (this.userService.isCurrentUserHasRole('ROLE_PREMIUM') && image.acceptState === this.approved) {
            this.image = image;
        }

    }

    openProfileImageModal() {
        if (this.user && this.user.profileImage) {
            this.image = this.user.profileImage;
        } else {
            this.image = null;
        }
    }

    openProfileImageModalFromGallery(image) {
        if (image && this.userService.isCurrentUserHasRole('ROLE_PREMIUM') && image.acceptState === this.approved) {
            this.image = image;
        }
    }

    shareAllImageToThisUser() {
        this.sharedImageService.shareAllGalleryImageAndProfileImage(this.user).subscribe(value => {
            this.sharedAllImageCondition(this.user);
            this.createSharedAllImageFeedInfo();
        }, error => {
            console.log(error);
        });
    }

    unShareAllImageToThisUser() {
        this.sharedImageService.unShareAllGalleryImageAndProfileImage(this.user).subscribe(value => {
            this.sharedAllImageCondition(this.user);
        }, error => {
            console.log(error);
        });
    }

    clickReadMore(isReadMore) {
        this.readMore = isReadMore;
    }

    clickReadMoreStatus(isReadMore) {
        this.readMoreStatus = isReadMore;
    }

    sendReport(statusReport: ReportType) {
        const currentUser = this.tokenService.getPayload();
        const report = new Report();
        report.type = statusReport;
        report.reportingUser = currentUser._id;
        report.reportedUser = this.user._id;
        if (statusReport === this.statusReport) {
            report.content = this.user && this.user.status ? this.user.status : null;
        } else if (statusReport === this.aboutReport) {
            report.content = this.user && this.user.about ? this.user.about : null;
        } else if (statusReport === this.messageReport) {

        }

        this.reportService.create(report).subscribe((data: any) => {
            console.log(data);
            this.findByTypeAndReportedUser();
        }, error => {
            this.findByTypeAndReportedUser();
        });
    }

    sharedAllImageCondition(user: IUser) {
        this.sharedAllImageConditionService.findByToUser(user._id)
            .subscribe((value: any) => {
                this.isSharedAllImageCondition = value.body ? value.body.active : false;
            }, err => {
                this.isSharedAllImageCondition = false;
            });
    }

    createSharedAllImageFeedInfo() {
        const currentUser = this.tokenService.getPayload();
        const shareAllImage = UserRecentTransactionType.SHAREALLIMAGE;
        const userRecentTransaction = new UserRecentTransaction();
        userRecentTransaction.fromUser = currentUser;
        userRecentTransaction.user = this.user;
        userRecentTransaction.type = shareAllImage;
        this.userRecentTransactionService.create(userRecentTransaction).subscribe();
    }

    findByTypeAndReportedUser() {
        this.reportService.findByTypeAndReportedUser(ReportType.STATUS, this.user._id).subscribe(value => {
            this.isStatusReportAvailable = value.body;
        }, error => {
            this.isStatusReportAvailable = false;
        });

        this.reportService.findByTypeAndReportedUser(ReportType.UBERMICH, this.user._id).subscribe(value => {
            this.isAboutReportAvailable = value.body;
        }, error => {
            this.isAboutReportAvailable = false;
        });
    }

    addUserToBlockList() {
        if (this.user) {
            this.userService.addUserToBlockList(this.user._id).subscribe((data: any) => {
                this.getAllUser(false);
            });
        }
    }
}
