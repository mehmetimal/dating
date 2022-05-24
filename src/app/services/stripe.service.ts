import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StripeService {

    private readonly resourceUrl: string = '/stripe';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    payment(paymentInfo): Observable<any> {
        return this.http
            .post<any>(`${this.resourceUrl}/payment`, paymentInfo, {observe: 'response'})
            .pipe(map((res: any) => res));
    }
}
