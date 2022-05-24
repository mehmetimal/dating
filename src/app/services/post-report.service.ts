import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFooter} from '../model/footer.model';
import {IPostReport} from "../model/post-report.model";
import {ISettings} from "../model/settings.model";

type EntityResponseType = HttpResponse<IPostReport>;

@Injectable({
    providedIn: 'root'
})
export class PostReportService {

    private readonly resourceUrl: string = '/post-report';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    create(postReport: IPostReport): Observable<EntityResponseType> {
        return this.http
            .post<ISettings>(`${this.resourceUrl}`, postReport, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
