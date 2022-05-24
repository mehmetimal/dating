import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Options} from 'ng5-slider';
import {PostCategoryService} from '../../../../services/post-category.service';
import {PostService} from "../../../../services/post.service";
import {UserService} from "../../../../services/user.service";
import {PostFilter} from "../../../../model/post-filter.model";
import {JhiEventManager} from "../../../../services/event-manager.service";
import {VipErrorModalComponent} from '../../messages/vip-error-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TokenService} from '../../../../services/token.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
    selector: 'app-post-filter',
    templateUrl: './post-filter.component.html',
    styleUrls: ['./post-filter.component.scss']
})
export class PostFilterComponent implements OnInit {
    @Output() valueChange = new EventEmitter();
    public warningToolTipChange = false;
    public postFilter = new PostFilter();
    postMainCategoryOptions: any[];
    manualRefresh: EventEmitter<void> = new EventEmitter<void>();
    distance = 100;
    options: Options = {
        showTicksValues: true,
        getTickColor: (value: number): string => {
            return '#666666';
        },
        stepsArray: [
            {value: 100},
            {value: 150},
            {value: 200},
            {value: 250},
            {value: 300}
        ]
    };
    plzTimeoutErr = false;
    plzNameTimeout;
    public vipErrorModalCheckbox = false;

    constructor(private postCategoryService: PostCategoryService,
                private postService: PostService,
                private eventManager: JhiEventManager,
                private userService: UserService,
                private modalService: NgbModal,
                private tokenService: TokenService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.initializeForm();
        this.eventManager.subscribe('change-vip-error-modal-checkbox', (data) => {
            this.vipErrorModalCheckbox = data.content;
        });
    }

 /*   openAddModal(popContent) {
        if (this.localStorageService.retrieve('isClubboardModalOpen')) {
            this.openModal(popContent);
        } else {
            const content = 'du hast Lust auf ein Eis mit einer heißen Begleitung oder einen gemütlichen Kinoabend und mehr? Hier kannst du selbst nach einem Date suchen oder auf die Date-Anfragen anderer in deiner Nähe antworten.';
            const modalRef = this.modalService.open(VipErrorModalComponent, {
                centered: true,
                backdropClass: 'vip-error-modal-header-margin',
                windowClass: 'vip-error-modal-header-margin vip-error-modal-background-color'
            });
            const currentUser = this.tokenService.getPayload();
            modalRef.componentInstance.name = currentUser.profileName;
            modalRef.componentInstance.content = content;
            modalRef.componentInstance.isClose = true;
            modalRef.componentInstance.isUrl = true;
            modalRef.componentInstance.urlText = 'Hilfe zum Clubboard';
            modalRef.componentInstance.isCheckbox = true;
            modalRef.result.then(() => {
            }, (result) => {
                this.localStorageService.store('isClubboardModalOpen', this.vipErrorModalCheckbox);
                this.openModal(popContent);
            });
        }
    }*/

    openModal(popContent) {
        const isRolePremium = this.userService.isCurrentUserHasRole('ROLE_PREMIUM');
        if (isRolePremium) {
            this.valueChange.emit('open');
        } else {
            this.postService.countOfPostOfCurrentUser().subscribe(value => {
                if (value >= 1) {
                    this.warningToolTipChange = true;
                    if (popContent && !popContent.isOpen()) {
                        popContent.open();
                        setTimeout(() => {
                            if (popContent.isOpen()) {
                                popContent.close();
                            }
                        }, 1000 * 60);
                    }

                } else {
                    this.valueChange.emit('open');
                }
            });
        }
    }

    initializeForm() {
        this.postFilter = new PostFilter();
        this.postFilter.distance = 100;
        this.postFilter.isSearchNear = true;
        this.postFilter.postCode = null;
        this.postFilter.sortCriteria = false;
        this.postFilter.category = null;
        this.postCategoryService.findAllParent().subscribe((data: any) => {
            this.postMainCategoryOptions = data.body.response;
        });
    }

    plzChanged(event: any) {
        clearTimeout(this.plzNameTimeout);
        this.plzTimeoutErr = false;
        this.plzNameTimeout = setTimeout(() => {
            if (event.keyCode !== 13) {
                const plz = this.postFilter.postCode;
                if (plz && plz.length < 5) {
                    this.plzTimeoutErr = true;
                }
            }
        }, 2000);
    }

    searchPostsByFilters() {
        this.eventManager.broadcast({
            name: 'user-post-filter-change',
            content: {
                category: this.postFilter.category,
                sortCriteria: this.postFilter.sortCriteria,
                postCode: this.postFilter.postCode,
                distance: this.postFilter.distance,
                isSearchNear: this.postFilter.isSearchNear
            }
        });
    }

}
