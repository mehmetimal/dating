import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ContactService {

    private readonly resourceUrl: string = '/contact';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    contactFormPost(data) {
        return this.http.post(`${this.resourceUrl}`, data, {observe: 'response'})
            .pipe(map((res: any) => res));
    }
}
