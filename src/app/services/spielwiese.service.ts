import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ISpielwiese} from '../model/spielwiese.model';
import {environment} from '../../environments/environment';

type EntityArrayResponseType = HttpResponse<ISpielwiese[]>;
type EntityResponseType = HttpResponse<ISpielwiese>;

@Injectable({
    providedIn: 'root'
})
export class SpielwieseService {

    private readonly resourceUrl: string = '/Spielwiese';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

}
