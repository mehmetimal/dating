import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HelpModalService {

    private readonly resourceUrl: string = '/help-modal';
    private http: HttpClient;

    constructor(handler: HttpBackend) {
        this.resourceUrl = environment.url + this.resourceUrl;
        this.http = new HttpClient(handler);
    }

    helpModalGet() {
        return this.http.get(this.resourceUrl);
    }

    helpModalGetIdTitle(title) {
        return this.http.get(`${this.resourceUrl}/${title}`);
    }

}
