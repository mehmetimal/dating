import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IHairLength} from '../model/hair-length.model';

type EntityResponseType = HttpResponse<IHairLength>;
type EntityArrayResponseType = HttpResponse<IHairLength[]>;

@Injectable({
    providedIn: 'root'
})
export class HairLengthService {

    private readonly resourceUrl: string = '/profile-questions/hair-length';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
