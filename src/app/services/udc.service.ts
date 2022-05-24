import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IUdc} from '../model/udc.model';
import {environment} from '../../environments/environment';


type EntityArrayResponseType = HttpResponse<IUdc[]>;
type EntityResponseType = HttpResponse<IUdc>;

@Injectable({
    providedIn: 'root'
})
export class UdcService {

    private readonly resourceUrl: string = '/udc';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }

}
