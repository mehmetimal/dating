import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IBodyTypes} from '../model/body-types.model';

type EntityResponseType = HttpResponse<IBodyTypes>;
type EntityArrayResponseType = HttpResponse<IBodyTypes[]>;

@Injectable({
    providedIn: 'root'
})
export class BodyTypesService {

    private readonly resourceUrl: string = '/profile-questions/body-types';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
