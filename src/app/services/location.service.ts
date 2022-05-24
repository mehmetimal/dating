import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ILocation} from '../model/location.model';

type EntityResponseType = HttpResponse<ILocation>;
type EntityArrayResponseType = HttpResponse<ILocation[]>;

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private readonly resourceUrl: string = '/profile-questions/locations';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
