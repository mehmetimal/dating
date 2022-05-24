import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ISettings} from '../model/settings.model';
import {environment} from '../../environments/environment';
import {IUserRecentTransaction} from '../model/user-recent-transaction.model';

type EntityResponseType = HttpResponse<IUserRecentTransaction>;
type EntityArrayResponseType = HttpResponse<IUserRecentTransaction[]>;

@Injectable({
    providedIn: 'root'
})
export class UserRecentTransactionService {

    private readonly resourceUrl: string = '/user-recent-transaction';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findByCurrentUser(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    create(userRecentTransaction: IUserRecentTransaction): Observable<EntityResponseType> {
        return this.http
            .post<IUserRecentTransaction>(`${this.resourceUrl}`, userRecentTransaction, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    update(userRecentTransaction: IUserRecentTransaction): Observable<EntityResponseType> {
        return this.http
            .put<IUserRecentTransaction>(`${this.resourceUrl}`, userRecentTransaction, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    changeAllActiveFalse(): Observable<EntityArrayResponseType> {
        return this.http.put(this.resourceUrl + '/change-all-transaction-false', {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

}
