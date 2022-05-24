import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IPost} from '../../../../model/post.model';
import {PostService} from '../../../../services/post.service';
import {PostCategoryService} from '../../../../services/post-category.service';
import {TokenService} from '../../../../services/token.service';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {UdcService} from '../../../../services/udc.service';
import {switchMap} from 'rxjs/operators';
import {UdcNameEnum} from '../../../../model/udc-name.enum';
import {PostReportService} from "../../../../services/post-report.service";
import {PostReport} from "../../../../model/post-report.model";

@Component({
    selector: 'app-post-detail-modal',
    templateUrl: './post-detail-modal.component.html',
    styleUrls: ['./post-detail-modal.component.scss']
})
export class PostDetailModalComponent implements OnInit {

    @Input() detailCard;

    @Input() selectedImage;

    @Input() updatePostModalRef: NgbModalRef;

    @Input() post: any;

    @Input() cards: IPost[] = [];

    @Input() udcImagesNameList = [];

    @Input() viewCount: number;

    imageModalRef: NgbModalRef;

    public backendURL = environment.url;

    textTitle = false;

    textContent = false;

    deletePostModalRef: NgbModalRef;

    postMainCategoryOptions: any[];

    postSubCategoryOptions: any[];

    public currentUser;
    public calcuateEndDate;

    public bsModalRef: NgbModalRef;

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

    constructor(private modalService: NgbModal,
                private postService: PostService,
                private tokenService: TokenService,
                private postCategoryService: PostCategoryService,
                private router: Router,
                private postReportService: PostReportService,
                private udcService: UdcService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.subscribeSelectImageChange();
        const createdDate = new Date(this.detailCard[0].createdAt);
        const date = moment(createdDate).add(this.detailCard[0].visibleNumberOfDays, 'days');
        const daysDiff = date.diff(moment(), 'days');
        this.calcuateEndDate = daysDiff;
        this.currentUser = this.tokenService.getPayload();

        this.udcService.findAll().pipe(
            switchMap((data: any) => {
                this.udc = data.body ? data.body.response : [];
                if (this.udc && this.udc.length > 0) {
                    const clubbesuch = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Clubbesuch_500x500)[0];
                    if (clubbesuch) {
                        this.clubbesuchImage = clubbesuch.image;
                    }

                    const cocktails = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Cocktails_500x500)[0];
                    if (cocktails) {
                        this.cocktailsImage = cocktails.image;
                    }

                    const dinner = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Dinner_500x500)[0];
                    if (dinner) {
                        this.dinnerImage = dinner.image;
                    }

                    const fotografieVideo = this.udc.filter(val => val.name && val.name.name
                        === UdcNameEnum.Clubboard_FotografieVideo_500x500)[0];
                    if (fotografieVideo) {
                        this.fotografieVideoImage = fotografieVideo.image;
                    }

                    const paerchenabend = this.udc.filter(val => val.name && val.name.name
                        === UdcNameEnum.Clubboard_Paerchenabend_500x500)[0];
                    if (paerchenabend) {
                        this.paerchenabendImage = paerchenabend.image;
                    }

                    const sauna = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Paerchenabend_500x500)[0];
                    if (sauna) {
                        this.saunaImage = sauna.image;
                    }

                    const sonstiges = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Sonstiges_500x500)[0];
                    if (sonstiges) {
                        this.sonstigesImage = sonstiges.image;
                    }

                    const sport = this.udc.filter(val => val.name && val.name.name === UdcNameEnum.Clubboard_Sport_500x500)[0];
                    if (sport) {
                        this.sonstigesImage = sport.image;
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

        if (this.detailCard[0].postMainCategory && this.detailCard[0].postMainCategory._id) {
            this.postCategoryService.findChildreenById(this.detailCard[0].postMainCategory._id).subscribe((data: any) => {
                this.postSubCategoryOptions = data.body.response;
            });
        }
    }

    openImageGallery(image) {
        if (this.textTitle) {
            this.selectedImage = null;
            this.imageModalRef = this.modalService.open(image, {centered: true});
        }
    }

    editCard() {
        this.textTitle = true;
        this.textContent = true;
    }

    deletePost(deletePostModal) {
        this.deletePostModalRef = this.modalService.open(deletePostModal, {centered: true});
    }

    update(updatedPost: IPost) {
        if (this.selectedImage && (this.selectedImage !== null && this.selectedImage !== undefined)) {
            updatedPost.image = this.selectedImage;
        }
        this.postService.update(updatedPost).subscribe((data: any) => {
            const postResId = data.body.response._id;
            const updateItem = this.cards.find(x => x._id === postResId);
            const index = this.cards.indexOf(updateItem);
            this.cards[index] = data.body.response;
            const copy = [...this.cards];
            this.cards = [...copy];
            this.eventManager.broadcast({
                name: 'postCardDetailChanged',
                content: this.cards
            });
            this.updatePostModalRef.close();
        });
    }

    changeMainCategory() {
        this.postSubCategoryOptions = [];
        this.detailCard[0].postSubCategory = null;
        if (this.detailCard[0].postMainCategory) {
            this.postCategoryService.findChildreenById(this.detailCard[0].postMainCategory._id).subscribe((data: any) => {
                this.postSubCategoryOptions = data.body.response;
            });
        }

        const mainCategory = this.postMainCategoryOptions.filter(value => value && value._id
            === this.detailCard[0].postMainCategory._id)[0];
        const mainCategoryName = mainCategory.name;

        if (mainCategoryName.toLowerCase() === 'clubbesuch') {
            this.selectedImage = this.clubbesuchImage;
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
        } else if (mainCategoryName.toLowerCase() === 'suche_ffm') {
            this.selectedImage = this.sucheFfmImage;
        } else if (mainCategoryName.toLowerCase() === 'suche_mfm') {
            this.selectedImage = this.sucheMfmImage;
        } else if (mainCategoryName.toLowerCase() === 'swinger') {
            this.selectedImage = this.swingerImage;
        } else if (mainCategoryName.toLowerCase() === 'treffen') {
            this.selectedImage = this.treffenImage;
        }

    }

    goToMessageOfPost(user) {
        this.updatePostModalRef.close();
        const convertUser = JSON.stringify(user);
        this.router.navigateByUrl('/messages', {state: {data: convertUser}});

    }

    openFavoriteModal(content) {
        this.bsModalRef = this.modalService.open(content, {centered: true});
    }

    subscribeSelectImageChange() {
        this.eventManager.subscribe('post-image-modal-select-image-changed', (res: any) => {
            if (res.content) {
                this.selectedImage = res.content;
            }
        });
    }

    createPostReport(post: any) {
        const currentUser = this.tokenService.getPayload();
        const postReport = new PostReport();
        postReport.post = post;
        postReport.reportUser = currentUser;
        this.postReportService.create(postReport).subscribe(value => {
            console.log(value);
        }, error => {
            console.log(error);
        })
    }
}
