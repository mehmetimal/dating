import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ILandingPageSocialMedia} from '../model/landing-page-social-media.model';
type EntityResponseType = HttpResponse<ILandingPageSocialMedia>;
@Injectable({
    providedIn: 'root'
})
export class LandingPageSocialMediaService {

    private readonly resourceUrl: string = '/landing-page-social-media';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
