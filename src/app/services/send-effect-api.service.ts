import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ISurvey} from '../model/survey.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
type EntityResponseType = HttpResponse<ISurvey>;
@Injectable({
    providedIn: 'root'
})
export class SendEffectApiService {

    private readonly resourceUrl: string = '/send-effect-api';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

}
