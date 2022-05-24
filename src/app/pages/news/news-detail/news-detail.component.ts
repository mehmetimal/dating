import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {NewsService} from '../../../services/news.service';
import {INews, News} from '../../../model/news.model';
import {TokenService} from "../../../services/token.service";

@Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

    public news: INews = new News();
    public id: string;
    public backNews: INews;
    public nextNews: INews;

    constructor(private route: ActivatedRoute,
                private tokenService: TokenService,
                private newsService: NewsService) {


    }

    ngOnInit() {
        const currentUser = this.tokenService.getPayload();
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.resetForm();
            if(currentUser) {
                this.findOne(this.id);
                this.nextNewsAccordingToCurrentNews(this.id);
                this.backNewsAccordingToCurrentNews(this.id);
            } else {
                this.findOneUnAuth(this.id);
                this.nextNewsAccordingToCurrentNewsUnAuth(this.id);
                this.backNewsAccordingToCurrentNewsUnAuth(this.id);
            }

        });
    }

    resetForm() {
        this.news = new News();
    }

    findOneUnAuth(id) {
        this.newsService.findOne(id).subscribe(res => {
            const response = res.body;
            this.news = response;
        }, error => {
            console.log(error);
        });

    }

    findOne(id) {
        this.newsService.findOne(id).subscribe(res => {
            const response = res.body;
            this.news = response;
        }, error => {
            console.log(error);
        });

    }

    nextNewsAccordingToCurrentNews(id) {
        this.newsService.nextNewsAccordingToCurrentNews(id).subscribe(res => {
            const response = res.body;
            this.nextNews = response;

        }, error => {
            console.log(error);
        });
    }

    nextNewsAccordingToCurrentNewsUnAuth(id) {
        this.newsService.nextNewsAccordingToCurrentNews(id).subscribe(res => {
            const response = res.body;
            this.nextNews = response;

        }, error => {
            console.log(error);
        });
    }

    backNewsAccordingToCurrentNewsUnAuth(id) {
        this.newsService.backNewsAccordingToCurrentNews(id).subscribe(res => {
            const response = res.body;
            this.backNews = response;

        }, error => {
            console.log(error);
        });
    }

    backNewsAccordingToCurrentNews(id) {
        this.newsService.backNewsAccordingToCurrentNews(id).subscribe(res => {
            const response = res.body;
            this.backNews = response;

        }, error => {
            console.log(error);
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
    }
}
