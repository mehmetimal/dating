import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IRegisterPin} from '../model/register-pin.model';
import {environment} from '../../environments/environment';

type EntityResponseType = HttpResponse<IRegisterPin>;

@Injectable({
    providedIn: 'root'
})
export class RegisterPinService {

    private readonly resourceUrl: string = '/register-pin';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOneByActive(password: string): Observable<EntityResponseType> {
        const params = new HttpParams().set('password', password);
        return this.http.get(this.resourceUrl + '/active', {observe: 'response', params: params})
            .pipe(map((res: EntityResponseType) => res));
    }

    isExistActivePin(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/is-exist-active-pin', {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }
}
