import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivationLogin} from "../model/activation-login.model";
type EntityResponseType = HttpResponse<ActivationLogin>;
@Injectable({
    providedIn: 'root'
})
export class ActivationLoginService {

    private readonly resourceUrl: string = '/activation-login';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
