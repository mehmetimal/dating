import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {IPostCategory} from '../model/post-category.model';

type EntityResponseType = HttpResponse<IPostCategory>;
type EntityArrayResponseType = HttpResponse<IPostCategory[]>;

@Injectable({
    providedIn: 'root'
})
export class PostCategoryService {

    private readonly resourceUrl: string = '/post-category';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAllParent() {
        return this.http.get(this.resourceUrl + '/findAllParent', {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findChildreenById(id: any) {
        return this.http.get(`${this.resourceUrl}/parent/${id}`, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
