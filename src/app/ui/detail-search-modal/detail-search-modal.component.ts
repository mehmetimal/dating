import {Component, EventEmitter, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {ISearchCriteria, SearchCriteria} from '../../model/searchCriteria.model';
import {Options} from 'ng5-slider';
import {IUserFeature} from '../../model/user-feature.model';
import {SearchCriteriaService} from '../../services/searchCriteria.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TokenService} from '../../services/token.service';
import {Router} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {JhiEventManager} from '../../services/event-manager.service';

@Component({
    selector: 'app-detail-search-modal',
    templateUrl: './detail-search-modal.component.html',
    styleUrls: ['./detail-search-modal.component.scss']
})
export class DetailSearchModalComponent implements OnInit {
    @Input() featureOptions: IUserFeature[];
    @Input() bsModalRef: NgbModalRef;
    public search = new SearchCriteria('', '', '', '', '', null, []);
    manualRefreshEnabled = true;
    manualRefresh: EventEmitter<void> = new EventEmitter<void>();
    distance: number;
    options: Options;
    isPlatformBrowser: boolean;

    searchCriteria: ISearchCriteria[];
    plzTimeoutErr = false;
    plzNameTimeout;

    public minAgeInput = '';
    public maxAgeInput = '';

    constructor(private searchCriteriaService: SearchCriteriaService,
                private eventManager: JhiEventManager,
                private modalService: NgbModal,
                private tokenService: TokenService,
                @Inject(PLATFORM_ID) private platformId: any,
                public router: Router) {
        this.isPlatformBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        this.searchCriteriaFindAll();
        this.initializeSearchDetailUsers();
    }

    saveSearchData(checkAvailableSearchCriteriaPopover) {
        this.search.userId = this.tokenService.getPayload()._id;
        this.search.distance = this.distance;
        this.search.minAgeValue =  this.minAgeInput;
        this.search.highAgeValue = this.maxAgeInput;

        const currentUser = this.tokenService.getPayload();
        if (currentUser) {
            this.searchCriteriaService.checkSavedSearchAvailable(currentUser._id).subscribe((data: any) => {
                const isAvailable = data.body;
                if (isAvailable) {
                    this.searchCriteriaService.create(this.search).subscribe((res: any) => {
                        this.searchCriteriaFindAll();
                    });
                } else {
                    checkAvailableSearchCriteriaPopover.open();
                }
            });
        }
    }

    searchDetailUsers() {
        const minAge = this.minAgeInput;
        const maxAge = this.maxAgeInput;
        this.eventManager.broadcast({
            name: 'user-detail-search-param-changed',
            content: {
                minAgeValue: minAge,
                highAgeValue: maxAge,
                features: this.search.features,
                distance: this.search.distance || this.distance,
                postCode: this.search.postCode,
                clubNumber: this.search.clubNumber
            }
        });
    }

    setFieldFromBackend(search: any) {
        this.searchCriteriaService.findOneById(search._id).subscribe(value => {
            const result = value.body;
            this.search.searchFilterName = result.searchFilterName;
            // this.setAgeInputFromBackend(result.minAgeValue, result.highAgeValue);
            this.maxAgeInput = result.highAgeValue;
            this.minAgeInput = result.minAgeValue;
            this.search.postCode = result.postCode;
            this.search.distance = result.distance;
            this.distance = result.distance;
            this.search.features = result.features;
        });
    }

    setAgeInputFromBackend(minAgeValue, highAgeValue) {
        if (minAgeValue && minAgeValue.length > 0) {
            // this.ageInput = minAgeValue + '-' + highAgeValue;
        } else if (!minAgeValue || minAgeValue.length <= 0) {
            // this.ageInput = null
        }
    }

    initializeSearchDetailUsers() {
        this.options = {
            showTicksValues: true,
            getTickColor: (value: number): string => {
                return '#666666';
            },
            getLegend: (value: number): string => {
                return '' + value;
            },
            stepsArray: [
                {value: 100},
                {value: 150},
                {value: 200},
                {value: 250},
                {value: 300}
            ]
        };
        this.distance = 100;
        if (this.manualRefreshEnabled) {
            // Bootstrap uses display CSS property to effect the collapse, so we need this to manually trigger a refresh
            this.manualRefresh.emit();
        }
    }

    searchCriteriaFindAll() {
        const currentUser = this.tokenService.getPayload();
        if (currentUser) {
            const _id = currentUser._id;
            this.searchCriteriaService.findAll(_id).subscribe((data) => {
                this.searchCriteria = data.body;
            });
        }
    }

    resetSelectedSearch() {
        this.searchCriteriaFindAll();
    }

    closeModal() {
        this.bsModalRef.close();
    }

    test(event) {
        /*if (this.ageInput && this.ageInput.length === 2 && event.key !== 'Backspace') {
            this.ageInput = this.ageInput + '-';
            this.resetSelectedSearch();
        }*/
    }

    changeFeature(event, item: IUserFeature) {
        this.resetSelectedSearch();
        const checked = event.target.checked;
        if (checked) {
            this.search.features.push(item);
        } else {
            const indexOfFeature = this.search.features.findIndex(value => value && value._id === item._id);
            this.search.features.splice(indexOfFeature, 1);
        }
    }

    findMinAge() {
       /* const result = this.ageInput.includes('-');
        if (result) {
            return this.ageInput.split('-')[0];
        } else {
            return this.ageInput.trim();
        }*/
    }

    findMaxAge() {
        /* const result = this.ageInput.includes('-');
        if (result) {
            return this.ageInput.split('-')[1];
        } else {
            return '';
        } */
    }

    checkedControl(id: string) {
        if (this.search && this.search.features) {
            return this.search.features.filter(value => value && value._id === id).length > 0 ? true : false;
        } else {
            return false;
        }
    }


    deleteSearchCriteria(search) {
        this.searchCriteriaService.delete(search._id).subscribe(value => {
            this.searchCriteriaFindAll();
        });
    }

    plzChanged(event: any) {
        clearTimeout(this.plzNameTimeout);
        this.plzTimeoutErr = false;
        this.plzNameTimeout = setTimeout(() => {
            if (event.keyCode !== 13) {
                const plz = this.search.postCode;
                if (plz && plz.length < 5) {
                    this.plzTimeoutErr = true;
                }
            }
        }, 2000);
    }
}
