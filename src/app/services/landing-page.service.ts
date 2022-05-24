import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ILandingPage} from '../model/landing-page.model';
type EntityResponseType = HttpResponse<ILandingPage>;
@Injectable({
    providedIn: 'root'
})
export class LandingPageService {

    private readonly resourceUrl: string = '/landing-page';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
