import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../../environments/environment';
import {IPost, Post} from '../../../model/post.model';
import {PostService} from '../../../services/post.service';
import {UserService} from '../../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {ImageService} from '../../../services/image.service';
import {IImage} from '../../../model/image.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Subscription} from 'rxjs';
import {JhiEventManager} from '../../../services/event-manager.service';
import {UdcService} from '../../../services/udc.service';
import {UdcNameEnum} from '../../../model/udc-name.enum';
import {TokenService} from '../../../services/token.service';
import {LocalStorageService} from 'ngx-webstorage';
import {VipErrorModalComponent} from '../messages/vip-error-modal.component';
import * as moment from 'moment';

declare var google;

@Component({
    selector: 'app-clubboard',
    templateUrl: './clubboard.component.html',
    styleUrls: ['./clubboard.component.scss']
})
export class ClubboardComponent implements OnInit, OnDestroy, AfterViewInit {
    public backendURL = environment.url;
    public currentPage = 1;
    public totalPosts: number;
    public currentUserProfileName: string;

    newPost: IPost;

    cards: IPost[] = [];
    udcImagesNameList: IImage[] = [];

    detailCard: any = [];

    textTitle = false;
    textContent = false;

    addPostModalRef: NgbModalRef;
    updatePostModalRef: NgbModalRef;

    deletePostValueYes: string;
    deletePostValueNo: string;

    public selectedImage: IImage;

    public currentDate;

    public postCardDetailChangedSubs: Subscription;
    public newPostAddedToClubBoardSubs: Subscription;
    public udcAllImagesSubs: Subscription;
    public postAllSubs: Subscription;
    public viewCount: number;

    isShow: boolean;
    topPosToStartShowing = 100;
    subs: Subscription;
    public vipErrorModalCheckbox = false;

    constructor(private modalService: NgbModal,
                private postService: PostService,
                private imageService: ImageService,
                private route: ActivatedRoute,
                public userService: UserService,
                private translateService: TranslateService,
                private udcService: UdcService,
                private eventManager: JhiEventManager,
                private tokenService: TokenService,
                private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        this.selectedImage = null;
        this.subscribeToCardChangeAfterUpdate();
        this.subscribeToTotalCountsChanged();
        this.getAllUdcImages();
        this.subscribeToAddingNewPost();
        this.subscribeToPostFilterChanged();
        this.route.paramMap.subscribe((params: ParamMap) => {
            const postId = params.get('id');
            if (postId) {
                this.findPostByParamsId(postId);
            } else {
                this.findAllPostsPageable();
            }
        });

        this.currentUserProfileName = this.userService.getUserProfileFromStorage();
        this.deletePostValueYes = this.translateService.instant('Yes');
        this.deletePostValueNo = this.translateService.instant('No');

        this.eventManager.subscribe('change-vip-error-modal-checkbox', (data) => {
            this.vipErrorModalCheckbox = data.content;
        });
    }

    ngAfterViewInit() {
        const currentUser = this.tokenService.getPayload();
        if (!this.localStorageService.retrieve(currentUser._id + 'isClubboardModalOpen')) {
            const content = 'du hast Lust auf ein Eis mit einer heißen Begleitung oder einen gemütlichen Kinoabend und mehr? Hier kannst du selbst nach einem Date suchen oder auf die Date-Anfragen anderer in deiner Nähe antworten.';
            const modalRef = this.modalService.open(VipErrorModalComponent, {
                centered: true,
                backdropClass: 'vip-error-modal-header-margin',
                windowClass: 'vip-error-modal-header-margin vip-error-modal-background-color'
            });
            modalRef.componentInstance.name = currentUser.profileName;
            modalRef.componentInstance.content = content;
            modalRef.componentInstance.isClose = true;
            modalRef.componentInstance.isUrl = true;
            modalRef.componentInstance.urlText = 'Hilfe zum Clubboard';
            modalRef.componentInstance.url = 'Anleitungen';
            modalRef.componentInstance.isCheckbox = true;

            modalRef.componentInstance.isBackButton = false;
            modalRef.componentInstance.isPriseButton = false;
            modalRef.result.then(() => {
            }, (result) => {
                this.localStorageService.store(currentUser._id + 'isClubboardModalOpen', this.vipErrorModalCheckbox);
            });
        }
    }

    editDisabled() {
        this.textTitle = false;
        this.textContent = false;
    }

    addPost(addClubboard, event?) {
        this.currentDate = Date.now();
        this.selectedImage = null;
        this.newPost = new Post();
        this.newPost.postMainCategory = null;
        this.newPost.postSubCategory = null;
        this.newPost.postPeriod = null;
        this.addPostModalRef = this.modalService.open(addClubboard, {centered: true});
    }

    cardDetail(card, cardDetailModal) {
        this.viewCount = 0;
        this.selectedImage = null;
        this.editDisabled();
        this.detailCard.splice(0, 1);
        const clone = {...card};
        this.detailCard = [...this.detailCard, clone];
        this.postService.viewedPost(this.detailCard[0]._id).subscribe(value => {
            this.viewCount = value.result;
            this.updatePostModalRef = this.modalService.open(cardDetailModal, {centered: true});
        }, error => {
            this.viewCount = error.error.result;
            this.updatePostModalRef = this.modalService.open(cardDetailModal, {centered: true});
        });
    }

    findAllPostsPageable() {
        this.cards = [];
        this.postService.findAllByFilters(this.currentPage).subscribe((res: any) => {
            this.totalPosts = res.body.response.total;
            this.cards = [...res.body.response.docs];
            this.calculateCard();
        });
    }

    findPostByParamsId(postId) {
        this.cards = [];
        this.postService.findPostByParamsId(postId).subscribe((res: any) => {
            this.totalPosts = res.body.response.total;
            this.cards = [...res.body.response.docs];
        });
    }

    loadMore() {
        if (this.userService.isCurrentUserHasRole('ROLE_PREMIUM')) {
            this.currentPage = this.currentPage + 1;
            this.postService.findAllByFilters(this.currentPage).subscribe((res: any) => {
                this.totalPosts = res.body.response.total;
                const tempArr = this.cards.concat(res.body.response.docs);
                this.cards = [];
                this.cards = tempArr;
                this.calculateCard();
            });
        }
    }


    getAllUdcImages() {
        this.udcService.findAll().subscribe((value: any) => {
            this.udcImagesNameList = [];
            const udc = value.body ? value.body.response : [];
            const clubboards = udc.filter(data => data.name
                && (data.name.name === UdcNameEnum.Clubboard_Clubbesuch_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Cocktails_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Dinner_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_FotografieVideo_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Kino_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Paerchenabend_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Sauna_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Sonstiges_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Sport_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_suche_FFM_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_suche_MFM_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Swinger_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Treffen_500x500 ||
                    data.name.name === UdcNameEnum.Clubboard_Urlaub_500x500
                ));


            clubboards.forEach(clubboard => {
                this.udcImagesNameList.push(clubboard.image);
            });
        });
    }

    subscribeToAddingNewPost() {
        this.newPostAddedToClubBoardSubs = this.eventManager.subscribe('new-post-added-to-club-board', (res) => {
            this.findAllPostsPageable();
        });
    }

    subscribeToCardChangeAfterUpdate() {
        this.postCardDetailChangedSubs = this.eventManager.subscribe('postCardDetailChanged', (res: any) => {
            this.cards = [...res.content];
        });
    }

    subscribeToTotalCountsChanged() {
        this.postCardDetailChangedSubs = this.eventManager.subscribe('total-count-of-posts-changed', (data: any) => {
            this.currentPage = 1;
            this.cards = [];
            this.postService.findAllByFilters(this.currentPage).subscribe((res: any) => {
                this.totalPosts = res.body.response.total;
                this.cards = [...res.body.response.docs];
                this.calculateCard();
            });
        });
    }

    ngOnDestroy(): void {
        if (this.newPostAddedToClubBoardSubs) {
            this.eventManager.destroy(this.newPostAddedToClubBoardSubs);
        }
        if (this.postCardDetailChangedSubs) {
            this.eventManager.destroy(this.postCardDetailChangedSubs);
        }

        if (this.udcAllImagesSubs) {
            this.udcAllImagesSubs.unsubscribe();
        }

        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= this.topPosToStartShowing) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
    }

    // TODO: Cross browsing
    gotoTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    subscribeToPostFilterChanged() {
        this.subs = this.eventManager.subscribe(
            'user-post-filter-change',
            response => {
                const content = response.content;
                const category = content.category;
                const sortCriteria = content.sortCriteria;
                const postCode = content.postCode;
                const distance = content.distance;
                const isSearchNear = content.isSearchNear;
                if(isSearchNear && postCode) {
                    const locationPromise = this.getLocationFromAddress(distance, postCode);
                    Promise.resolve(locationPromise).then(returnVals => {
                        const lat = returnVals[0];
                        const lng = returnVals[1];
                        this.getPostsWithDetailSearch(this.currentPage, category, sortCriteria, postCode, isSearchNear, distance, lat, lng);
                    }).catch((err) => {
                    });
                } else {
                    this.getPostsWithDetailSearch(this.currentPage, category, sortCriteria, postCode);
                }

            }
        );
    }

    getPostsWithDetailSearch(page, category, sortCriteria, postCode, isSearchNear = null, distance = null, lat = null, lng = null) {
        this.cards = [];
        this.postService.findAllByFilters(page, category, sortCriteria, postCode, isSearchNear, distance, lat, lng).subscribe((res: any) => {
            this.totalPosts = res.body.response.total;
            this.cards = [...res.body.response.docs];
            this.calculateCard();
        });
    }

    getLocationFromAddress(distance, postCode) {
        // tslint:disable-next-line:only-arrow-functions
        return new Promise(function (resolve, reject) {
            const geocoder = new google.maps.Geocoder();

            let lat = '';
            let lng = '';
            geocoder.geocode({
                    componentRestrictions: {
                        country: 'DE',
                        postalCode: postCode
                    }
                    // tslint:disable-next-line:only-arrow-functions
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
                        resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
                    } else {
                        reject(new Error('Standort 23 konnte nicht gefunden werden ' + postCode));
                    }
                }
            );
        });

    }

    calculateCard() {
        this.cards.forEach((card: any) => {
            card.user.birthday = this.calculateAge(card.user.birthday);
        });

        console.log(this.cards);
    }

    calculateAge(birthday) {
        if (birthday) {
            const date1 = moment(birthday);
            const date2 = moment();
            return date2.diff(date1, 'years');
        } else {
            return null;
        }
    }

}
