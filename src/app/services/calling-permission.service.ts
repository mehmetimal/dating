import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ICallingPermission} from '../model/calling-permission.model';

type EntityResponseType = HttpResponse<ICallingPermission>;

@Injectable({
    providedIn: 'root'
})
export class CallingPermissionService {

    private readonly resourceUrl: string = '/calling-permission';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    createOrUpdate(callingPermission: ICallingPermission): Observable<EntityResponseType> {
        return this.http
            .post<ICallingPermission>(`${this.resourceUrl}`, callingPermission, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    findByFriend(friendId: string): Observable<HttpResponse<any>> {
        return this.http.get(this.resourceUrl + '/find-by-friend/' + friendId, {observe: 'response'})
            .pipe(map((res: HttpResponse<any>) => res));
    }


    findCallingPermissionOfFriend(friendId: string): Observable<HttpResponse<any>> {
        return this.http.get(this.resourceUrl + '/find-calling-permission-of-friend/' + friendId, {observe: 'response'})
            .pipe(map((res: HttpResponse<any>) => res));
    }

    changeCallingPermissionStatusOfFriend(callingPermission: ICallingPermission): Observable<EntityResponseType> {
        return this.http
            .put<ICallingPermission>(`${this.resourceUrl}`, callingPermission, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
