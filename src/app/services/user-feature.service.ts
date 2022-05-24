import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IUserFeature} from '../model/user-feature.model';

type EntityResponseType = HttpResponse<IUserFeature>;
type EntityArrayResponseType = HttpResponse<IUserFeature[]>;

@Injectable({
    providedIn: 'root'
})
export class UserFeatureService {

    private readonly resourceUrl: string = '/profile-questions/user-features';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
