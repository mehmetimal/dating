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
export class SurveyService {

    private readonly resourceUrl: string = '/survey';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }
    findHtml() {
        return this.http.get(this.resourceUrl + '/getHtml');
    }

}
