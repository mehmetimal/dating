import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

type EntityResponseType = HttpResponse<any>;
@Injectable({
    providedIn: 'root'
})
export class ClientIpService {

    private readonly resourceUrl: string = 'https://jsonip.com';

    constructor(private http: HttpClient) {
    }

    getIp(): Observable<EntityResponseType> {
        return this.http.get('https://jsonip.com', {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }
}
