import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IGeneralConfig} from '../model/system-config.model';

type EntityArrayResponseType = HttpResponse<IGeneralConfig[]>;

@Injectable({
    providedIn: 'root'
})
export class SystemConfigService {

    private readonly resourceUrl: string = '/systemConfig';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get(this.resourceUrl, {observe: 'response', params})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}

