import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFooter} from '../model/footer.model';

type EntityResponseType = HttpResponse<IFooter>;

@Injectable({
    providedIn: 'root'
})
export class FooterService {

    private readonly resourceUrl: string = '/footer';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    getCurrentYear(): Observable<HttpResponse<number>> {
        return this.http.get(this.resourceUrl + '/current-year', {observe: 'response'})
            .pipe(map((res: HttpResponse<number>) => res));
    }

}
