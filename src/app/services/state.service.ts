import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IState} from '../model/state.model';

type EntityResponseType = HttpResponse<IState>;
type EntityArrayResponseType = HttpResponse<IState[]>;

@Injectable({
    providedIn: 'root'
})
export class StateService {

    private readonly resourceUrl: string = '/profile-questions/states';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
