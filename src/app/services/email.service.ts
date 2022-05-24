import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    private readonly resourceUrl: string = '/email-api';

    // private readonly resourceUrlSendEffect: string = '/send-effect-api';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
        // this.resourceUrlSendEffect = environment.url + this.resourceUrlSendEffect;
    }

    sendEmail(to: string) {
        const body = {
            to
        };
        return this.http.post(this.resourceUrl + '/email/sendEmail', body).pipe(map(res => res));
    }

    /**
     sendEmailViaSendEffectAPI(to: string) {
        const body = {
            to
        };
        return this.http.post(this.resourceUrlSendEffect + '/sendEffect/sendEmail', body).pipe(map(res => res));;
    }
     **/

}
