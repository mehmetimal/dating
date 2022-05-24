import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ISharedAllImageCondition} from '../model/shared-all-image-condition.model';
import {Observable} from "rxjs";

type EntityResponseType = HttpResponse<ISharedAllImageCondition>;
type EntityArrayResponseType = HttpResponse<ISharedAllImageCondition[]>;

@Injectable({
    providedIn: 'root'
})
export class SharedAllImageConditionService {

    private readonly resourceUrl: string = '/shared-all-image-condition';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findByToUser(id: string): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/findByToUser/' + id, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }
}
