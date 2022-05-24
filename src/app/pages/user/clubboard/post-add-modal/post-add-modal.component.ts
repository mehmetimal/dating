import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IPost} from '../../../../model/post.model';
import {PostService} from '../../../../services/post.service';

import {PostCategoryService} from '../../../../services/post-category.service';
import {PostPeriodService} from '../../../../services/post-period.service';
import {switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {UdcService} from '../../../../services/udc.service';
import {UdcNameEnum} from '../../../../model/udc-name.enum';

declare var google;

@Component({
    selector: 'app-post-add-modal',
    templateUrl: './post-add-modal.component.html',
    styleUrls: ['./post-add-modal.component.scss']
})
export class PostAddModalComponent implements OnInit, OnDestroy {

    @Input() selectedImage;

    @Input() udcImagesNameList = [];

    @Input() addPostModalRef: NgbModalRef;

    @Input() newPost: IPost;

    @Input() currentDate;

    @Input() currentUserProfileName;

    public backendURL = environment.url;


    postPeriodSubs: Subscription;
    postCategorySubs: Subscription;
    postCreateSubs: Subscription;

    postMainCategoryOptions: any[];

    postSubCategoryOptions: any[];

    postPeriodOptions: any[];

    imageModalRef: NgbModalRef;

    titleLength = 0;
    textLength = 0;

    public isPostCodeError;

    public udc;

    public clubbesuchImage;
    public cocktailsImage;
    public dinnerImage;
    public fotografieVideoImage;
    public paerchenabendImage;
    public saunaImage;
    public sonstigesImage;
    public sportImage;
    public sucheFfmImage;
    public sucheMfmImage;
    public swingerImage;
    public treffenImage;
    public kinoImage;
    public urlabImage;


    constructor(private modalService: NgbModal,
                private postService: PostService,
                private eventManager: JhiEventManager,
                private postCategoryService: PostCategoryService,
                private postPeriodService: PostPeriodService,
                private udcService: UdcService
    ) {
    }

    ngOnInit() {
        this.subscribeSelectImageChange();
        this.initializeForm();
    }

    openImageGallery(image) {
        this.selectedImage = null;
        this.imageModalRef = this.modalService.open(image, {centered: true});
    }

    titleInputLength(titleTextLength) {
        if (titleTextLength) {
            this.titleLength = titleTextLength.length;
        }
    }

    textAreaLength(contentTextLength) {
        if (contentTextLength) {
            this.textLength = contentTextLength.length;
        }
    }

    savePost() {
        if (this.selectedImage && (this.selectedImage !== null && this.selectedImage !== undefined)) {
            this.newPost.image = this.selectedImage;
        }
        this.postCreateSubs = this.postService.create(this.newPost).subscribe(data => {
            this.addPostModalRef.close();
            // Send broadcast about Add new post
            this.eventManager.broadcast({
                name: 'new-post-added-to-club-board'
            });
        }, error => {
            alert('Sie können bis zu 10 Beiträge hinzufügen');
        });

    }

    closeModal() {
        this.addPostModalRef.close();
    }

    subscribeSelectImageChange() {
        this.eventManager.subscribe('post-image-modal-select-image-changed', (res: any) => {
            if (res.content) {
                this.selectedImage = res.content;
            }
        });
    }

    initializeForm() {
        this.postPeriodSubs = this.postPeriodService.findAll().pipe(
            switchMap((data: any) => {
                this.postPeriodOptions = data.body;
                return this.udcService.findAll();
            }),
            switchMap((data: any) => {
                this.udc = data.body ? data.body.response : [];
                if (this.udc && this.udc.length > 0) {
                    const clubbesuch = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Clubbesuch_500x500)[0];
                    if (clubbesuch) {
                        this.clubbesuchImage = clubbesuch.image;
                    }

                    const urlab = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Urlaub_500x500)[0];
                    if (urlab) {
                        this.urlabImage = urlab.image;
                    }

                    const kino = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Kino_500x500)[0];
                    if (kino) {
                        this.kinoImage = kino.image;
                    }

                    const cocktails = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Cocktails_500x500)[0];
                    if (cocktails) {
                        this.cocktailsImage = cocktails.image;
                    }

                    const dinner = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Dinner_500x500)[0];
                    if (dinner) {
                        this.dinnerImage = dinner.image;
                    }

                    const fotografieVideo = this.udc.filter(val => val.name
                        && val.name.name === UdcNameEnum.Clubboard_FotografieVideo_500x500)[0];
                    if (fotografieVideo) {
                        this.fotografieVideoImage = fotografieVideo.image;
                    }

                    const paerchenabend = this.udc.filter(val => val.name
                        && val.name.name === UdcNameEnum.Clubboard_Paerchenabend_500x500)[0];
                    if (paerchenabend) {
                        this.paerchenabendImage = paerchenabend.image;
                    }

                    const sauna = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Sauna_500x500)[0];
                    if (sauna) {
                        this.saunaImage = sauna.image;
                    }

                    const sonstiges = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Sonstiges_500x500)[0];
                    if (sonstiges) {
                        this.sonstigesImage = sonstiges.image;
                    }

                    const sport = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Sport_500x500)[0];
                    if (sport) {
                        this.sportImage = sport.image;
                    }

                    const sucheFfm = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_suche_FFM_500x500)[0];
                    if (sucheFfm) {
                        this.sucheFfmImage = sucheFfm.image;
                    }

                    const sucheMfm = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_suche_MFM_500x500)[0];
                    if (sucheFfm) {
                        this.sucheMfmImage = sucheMfm.image;
                    }

                    const swinger = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Swinger_500x500)[0];
                    if (swinger) {
                        this.swingerImage = swinger.image;
                    }

                    const treffen = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Treffen_500x500)[0];
                    if (treffen) {
                        this.treffenImage = treffen.image;
                    }
                }

                return this.postCategoryService.findAllParent();
            })
        ).subscribe((data: any) => {
            this.postMainCategoryOptions = data.body.response;
        });
    }

    changeMainCategory() {
        this.selectedImage = null;
        this.postSubCategoryOptions = [];
        this.postCategorySubs = this.postCategoryService.findChildreenById(this.newPost.postMainCategory).subscribe((data: any) => {
            this.postSubCategoryOptions = data.body.response;
        });

        const mainCategory = this.postMainCategoryOptions.filter(value => value && value._id === this.newPost.postMainCategory)[0];
        const mainCategoryName = mainCategory.name;

        if (mainCategoryName.toLowerCase() === 'clubbesuch') {
            this.selectedImage = this.clubbesuchImage;
        } else if (mainCategoryName.toLowerCase() === 'urlaub') {
            this.selectedImage = this.urlabImage;
        } else if (mainCategoryName.toLowerCase() === 'kino') {
            this.selectedImage = this.kinoImage;
        } else if (mainCategoryName.toLowerCase() === 'cocktails') {
            this.selectedImage = this.cocktailsImage;
        } else if (mainCategoryName.toLowerCase() === 'dinner') {
            this.selectedImage = this.dinnerImage;
        } else if (mainCategoryName.toLowerCase() === 'fotografievideo') {
            this.selectedImage = this.fotografieVideoImage;
        } else if (mainCategoryName.toLowerCase() === 'paerchenabend') {
            this.selectedImage = this.paerchenabendImage;
        } else if (mainCategoryName.toLowerCase() === 'sauna') {
            this.selectedImage = this.saunaImage;
        } else if (mainCategoryName.toLowerCase() === 'sonstiges') {
            this.selectedImage = this.sonstigesImage;
        } else if (mainCategoryName.toLowerCase() === 'sport') {
            this.selectedImage = this.sportImage;
        } else if (mainCategoryName.toLowerCase() === 'suche ffm') {
            this.selectedImage = this.sucheFfmImage;
        } else if (mainCategoryName.toLowerCase() === 'suche mfm') {
            this.selectedImage = this.sucheMfmImage;
        } else if (mainCategoryName.toLowerCase() === 'swinger') {
            this.selectedImage = this.swingerImage;
        } else if (mainCategoryName.toLowerCase() === 'treffen') {
            this.selectedImage = this.treffenImage;
        }
    }

    ngOnDestroy(): void {
        if (this.postCreateSubs) {
            this.postCreateSubs.unsubscribe();
        }
        if (this.postPeriodSubs) {
            this.postPeriodSubs.unsubscribe();
        }
        if (this.postCategorySubs) {
            this.postCategorySubs.unsubscribe();
        }
    }

    getLocationFromAddress(address) {
        // tslint:disable-next-line:only-arrow-functions
        return new Promise(function (resolve, reject) {
            const geocoder = new google.maps.Geocoder();
            let lat = '';
            let lng = '';
            geocoder.geocode({
                    componentRestrictions: {
                        country: 'DE',
                        postalCode: address
                    }
                }, function (results, status) {
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
        this.isPostCodeError = false;
        if (this.newPost.postCode && this.newPost.postCode.length > 0) {
            this.getLocationFromAddress(this.newPost.postCode).then(value => {
                this.isPostCodeError = false;
                this.savePost();
            }).catch(reason => {
                this.isPostCodeError = true;
            });
        } else {
            this.savePost();
        }

    }
}
