import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {IPost} from "../model/post.model";

@Injectable({
    providedIn: 'root'
})
export class FooterLinkService {

    private readonly resourceUrl: string = '/footer-links';
    private http: HttpClient;

    constructor(handler: HttpBackend) {
        this.resourceUrl = environment.url + this.resourceUrl;
        this.http = new HttpClient(handler);
    }

    footerLinkGet() {
        return this.http.get(this.resourceUrl);
    }

    footerLinkGetIdTitle(title) {
        return this.http.get(`${this.resourceUrl}/${title}`);
    }

    checkCurrentUserAgbVersion(email, password): Observable<any> {
        return this.http.get(`${this.resourceUrl}/check-current-user-agb-version/${email}/${password}`, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    updateCurrentUserAgbVersion(email): Observable<any> {
        return this.http
            .put<any>(`${this.resourceUrl}/update-current-user-agb-version/${email}` , {observe: 'response'})
            .pipe(map((res: any) => res));
    }

}
