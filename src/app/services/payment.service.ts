import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPayment} from '../model/payment.model';

type EntityResponseType = HttpResponse<IPayment>;
type EntityArrayResponseType = HttpResponse<IPayment[]>;

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private readonly resourceUrl: string = '/payment';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    create(id, memberShipId): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/' + id + '/' + memberShipId, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
