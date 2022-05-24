import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IUdcName} from '../model/udc-name.model';
import {environment} from '../../environments/environment';


type EntityArrayResponseType = HttpResponse<IUdcName[]>;

@Injectable({
    providedIn: 'root'
})
export class UdcNameService {

    private readonly resourceUrl: string = '/udc-name';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
