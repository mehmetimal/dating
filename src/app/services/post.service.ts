import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {IPost} from '../model/post.model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

type EntityResponseType = HttpResponse<IPost>;
type EntityArrayResponseType = HttpResponse<IPost[]>;


@Injectable({
    providedIn: 'root'
})
export class PostService {

    private readonly resourceUrl: string = '/posts';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(page): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/query', {observe: 'response', params: {page: page}})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findAllByFilters(page, category = null, sortCriteria = null, postCode = null, isSearchNear = null, distance = null, lat = null, lng = null): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/query-by-filter', {
            observe: 'response', params: {
                page: page,
                category: category,
                sortCriteria: sortCriteria,
                postCode: postCode,
                isSearchNear: isSearchNear,
                distance: distance,
                lat: lat,
                lng: lng,
                random: Date.now().toString()
            }
        })
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findPostByParamsId(postId): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/findPostByParamsId/' + postId, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    create(post: IPost): Observable<EntityResponseType> {
        return this.http
            .post<IPost>(`${this.resourceUrl}/create`, post, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    update(post: IPost): Observable<EntityResponseType> {
        return this.http
            .put<IPost>(`${this.resourceUrl}/` + post._id, post, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    delete(post: IPost): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${post._id}`, {
            observe: 'response'
        });
    }

    findPostByUserId(userId): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/findByUserId/' + userId, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    likedPost(postId) {
        return this.http
            .post<any>(`${this.resourceUrl}/like/${postId}`, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    viewedPost(postId) {
        return this.http
            .post<any>(`${this.resourceUrl}/view/${postId}`, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    countOfPostOfCurrentUser() {
        return this.http.get(this.resourceUrl + '/find/current-user/count', {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }

}
