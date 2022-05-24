import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {IReport} from '../model/report.model';
import {ReportType} from "../model/report-type.enum";

type EntityResponseType = HttpResponse<IReport>;

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private readonly resourceUrl: string = '/report';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    create(report: IReport): Observable<EntityResponseType> {
        return this.http
            .post<IReport>(`${this.resourceUrl}`, report, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    reportBeforeAndAfterFiveMessage(report: IReport, _id: any): Observable<EntityResponseType> {
        return this.http
            .post<any>(`${this.resourceUrl}/report-before-and-after-five-message`, {report, _id}, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    update(report: IReport): Observable<EntityResponseType> {
        return this.http
            .put<IReport>(`${this.resourceUrl}`, report, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }

    findByTypeAndReportedUser(type: ReportType, reportedUserId: string): Observable<any> {
        return this.http.get(this.resourceUrl + '/find-by-reported-user/' + type + '/' + reportedUserId, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

}
