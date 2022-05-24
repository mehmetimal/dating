import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPaymentPage} from '../model/payment-page.model';
import {environment} from '../../environments/environment';

type EntityResponseType = HttpResponse<IPaymentPage>;

@Injectable({
    providedIn: 'root'
})
export class PaymentPageService {

    private readonly resourceUrl: string = '/payment-page';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
