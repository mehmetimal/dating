import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {INews} from '../model/news.model';

type EntityResponseType = HttpResponse<INews>;
type EntityArrayResponseType = HttpResponse<INews[]>;

@Injectable({
    providedIn: 'root'
})
export class NewsService {

    private readonly resourceUrl: string = '/news';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findAllUnAuth(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/unAuth', {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findOne(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/findOne', {observe: 'response', params: {
            id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    findOneUnAuth(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/findOneUnAuth', {observe: 'response', params: {
                id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    nextNewsAccordingToCurrentNews(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/nextNewsAccordingToCurrentNews', {observe: 'response', params: {
                id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    nextNewsAccordingToCurrentNewsUnAuth(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/nextNewsAccordingToCurrentNewsUnAuth', {observe: 'response', params: {
                id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    backNewsAccordingToCurrentNews(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/backNewsAccordingToCurrentNews', {observe: 'response', params: {
                id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    backNewsAccordingToCurrentNewsUnAuth(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/backNewsAccordingToCurrentNewsUnAuth', {observe: 'response', params: {
                id: id
            }})
            .pipe(map((res: EntityResponseType) => res));
    }

    findSearchedNewsByLimit3(title = null) {
        return this.http.get(this.resourceUrl + '/findSearchedNewsByTitleSortDateAndLimit3', {observe: 'response', params: {
            title: title
            }})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findSearchedNewsByLimit3UnAuth(title = null) {
        return this.http.get(this.resourceUrl + '/findSearchedNewsByTitleSortDateAndLimit3UnAuth', {observe: 'response', params: {
                title: title
            }})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    groupByDate() {
        return this.http.get(this.resourceUrl + '/groupByDate', {observe: 'response'})
            .pipe(map((res: HttpResponse<any[]>) => res));
    }

    groupByDateUnAuth() {
        return this.http.get(this.resourceUrl + '/groupByDateUnAuth', {observe: 'response'})
            .pipe(map((res: HttpResponse<any[]>) => res));
    }

    likeNews(newsId: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/like/${newsId}`,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    unLikeNews(newsId: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/unlike/${newsId}`,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }
}
