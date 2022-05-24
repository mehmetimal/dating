import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFavoriteUser} from '../model/favorite-user.model';

type EntityArrayResponseType = HttpResponse<IFavoriteUser[]>;

@Injectable({
    providedIn: 'root'
})
export class FavoriteUserService {

    private readonly resourceUrl: string = '/favorite-user';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findFavoriteUsersOfCurrentUser(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/sortByDateLast50', {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

}
