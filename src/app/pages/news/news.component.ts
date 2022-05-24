import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NewsService} from '../../services/news.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {from, Subscription} from 'rxjs';
import {filter, tap, toArray} from 'rxjs/operators';
import {GeneralConfig} from '../../model/system-config.model';
import * as moment from 'moment';
import {INews} from '../../model/news.model';
import {JhiEventManager} from '../../services/event-manager.service';
import {Router} from '@angular/router';
import {TokenService} from "../../services/token.service";

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewsComponent implements OnInit, OnDestroy {
    public rows: any = [];
    public selected: any = [];
    public model = new GeneralConfig(false);
    public newsFindAllSubs: Subscription;
    public title: string;

    public newsCard: INews[] = [];
    public popularNewsCard: any = [];
    public archiveCard: any = [];

    public isOpen = false;

    constructor(private newsService: NewsService,
                private modalService: NgbModal,
                private eventManager: JhiEventManager,
                private tokenService: TokenService,
                private router: Router){
    }

    ngOnInit(): void {
        const currentUser = this.tokenService.getPayload();
        if(currentUser) {
            this.findAll();
            this.searchNews();
            this.groupByDate();
        } else {
            this.findAllUnAuth();
            this.searchNewsUnAuth();
            this.groupByDateUnAuth();
        }
        this.searchNewsSubsEventManager();
    }

    searchNewsSubsEventManager() {
        const currentUser = this.tokenService.getPayload();
        this.eventManager.subscribe('search-news', (data) => {
            if(currentUser) {
                this.searchNews();
            } else {
                this.searchNewsUnAuth()
            }
        });
    }

    findAll() {
        this.newsFindAllSubs = this.newsService.findAll().subscribe((data) => {
            from(data.body).pipe(
                filter(value => value.isPublish === true),
                toArray()
            ).subscribe(response => {
                this.rows = response;
                this.newsCard = this.rows;
            });
        });
    }

    findAllUnAuth() {
        this.newsFindAllSubs = this.newsService.findAllUnAuth().subscribe((data) => {
            from(data.body).pipe(
                filter(value => value.isPublish === true),
                toArray()
            ).subscribe(response => {
                this.rows = response;
                this.newsCard = this.rows;
            });
        });
    }


    onSelect(event, detailModal) {
        event.target.closest('datatable-body-cell');
        setTimeout(() => {
            const a = event.target.closest('datatable-body-cell');
            if (a === null) {
                event.target.closest('datatable-body-cell');
            } else {
                event.target.closest('datatable-body-cell').blur();
                this.modalService.open(detailModal, {centered: true});
            }
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.newsFindAllSubs) {
            this.newsFindAllSubs.unsubscribe();
        }
    }

    searchNews() {
        this.newsFindAllSubs = this.newsService.findSearchedNewsByLimit3(this.title).subscribe((data) => {
            from(data.body).pipe(
                filter(value => value.isPublish === true),
                toArray()
            ).subscribe(response => {
                this.rows = response;
                this.popularNewsCard = this.rows;
            });
        });
    }

    searchNewsUnAuth() {
        this.newsFindAllSubs = this.newsService.findSearchedNewsByLimit3UnAuth(this.title).subscribe((data) => {
            from(data.body).pipe(
                filter(value => value.isPublish === true),
                toArray()
            ).subscribe(response => {
                this.rows = response;
                this.popularNewsCard = this.rows;
            });
        });
    }

    groupByDate() {
        moment.locale('de');
        this.newsService.groupByDate().subscribe((data) => {
            from(data.body).pipe(
                tap(val => {
                    val._id.month = moment().month(val._id.month).format('MMMM');
                    return val;
                }),
                toArray()
            ).subscribe(response => {
                this.archiveCard = response;
                console.log(this.archiveCard);
            });
        });
    }

    groupByDateUnAuth() {
        moment.locale('de');
        this.newsService.groupByDateUnAuth().subscribe((data) => {
            from(data.body).pipe(
                tap(val => {
                    val._id.month = moment().month(val._id.month).format('MMMM');
                    return val;
                }),
                toArray()
            ).subscribe(response => {
                this.archiveCard = response;
                console.log(this.archiveCard);
            });
        });
    }

    likeNews(news: INews) {
        this.newsService.likeNews(news._id).subscribe(response => {
            const newsReturn = response;
            this.updateLikeCondition(news, newsReturn);
        }, error => {
            if (error.status === 422) {
                this.newsService.unLikeNews(news._id).subscribe((data: any) => {
                    this.updateLikeCondition(news, data);
                });
            } else if (error.status === 500) {

            }
        });
    }

    updateLikeCondition(news, newsReturn) {
        const likes = newsReturn.likes;
        news.likes = likes;
        const popularNews = this.popularNewsCard.find(value => value._id === news._id);
        if (popularNews) {
            popularNews.likes = likes;
        }
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
    }

    detailPage(e, id) {
        const parentNode = e.target.parentNode;
        if (parentNode.id !== 'likeContent' && parentNode.id !== 'likeContentTwo') {
            this.router.navigateByUrl('/neuigkeiten/' + id);
        }
    }
}
