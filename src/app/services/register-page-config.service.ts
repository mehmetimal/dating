import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RegisterPageConfigService {

    private readonly resourceUrl: string = '/register-config';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    getRegisterPageConfig() {
        return this.http.get(this.resourceUrl + '/register-page-config').pipe(
            map(data => data)
        );
    }

    getRegisterFirstPageConfig() {
        return this.http.get(this.resourceUrl + '/register-first-page-config').pipe(
            map(data => data)
        );
    }

    getRegisterSecondPageConfig() {
        return this.http.get(this.resourceUrl + '/register-second-page-config').pipe(
            map(data => data)
        );
    }

    getRegisterThirdPageConfig() {
        return this.http.get(this.resourceUrl + '/register-third-page-config').pipe(
            map(data => data)
        );
    }
}
