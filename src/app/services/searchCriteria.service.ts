import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ISearchCriteria} from '../model/searchCriteria.model';

type EntityResponseType = HttpResponse<ISearchCriteria>;
type EntityArrayResponseType = HttpResponse<ISearchCriteria[]>;

@Injectable({
    providedIn: 'root'
})

export class SearchCriteriaService {

    private readonly resourceUrl: string = '/searchCriteria';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(id: string): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl + '/user/' + id, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    checkSavedSearchAvailable(id: string): Observable<any> {
        return this.http.get(this.resourceUrl + '/check-saved-search-available/' + id, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    create(searchCriteria: ISearchCriteria): Observable<EntityResponseType> {
        return this.http.post<ISearchCriteria>(`${this.resourceUrl}`, searchCriteria, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    findByLastCreatedCode(): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/findBy/lastCreatedCode', {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    findOneById(id): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/' + id, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }
}
