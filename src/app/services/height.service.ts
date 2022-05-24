import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IHeight} from '../model/height.model';

type EntityResponseType = HttpResponse<IHeight>;
type EntityArrayResponseType = HttpResponse<IHeight[]>;

@Injectable({
    providedIn: 'root'
})
export class HeightService {

    private readonly resourceUrl: string = '/profile-questions/height';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
