import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IProfileVisitors} from '../model/profile-visitors.model';

type EntityArrayResponseType = HttpResponse<IProfileVisitors[]>;

@Injectable({
    providedIn: 'root'
})
export class ProfileVisitorService {

    private readonly resourceUrl: string = '/profile-visitor';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findProfileVisitorsOfCurrentUser(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/sortByDateLast20', {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

}
