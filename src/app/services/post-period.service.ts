import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPostPeriod} from '../model/post-period.model';
import {environment} from '../../environments/environment';

type EntityArrayResponseType = HttpResponse<IPostPeriod[]>;
type EntityResponseType = HttpResponse<IPostPeriod>;

@Injectable({
    providedIn: 'root'
})
export class PostPeriodService {

    private readonly resourceUrl: string = '/post-period';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
