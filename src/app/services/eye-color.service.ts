import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IEyeColor} from '../model/eye-color.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

type EntityResponseType = HttpResponse<IEyeColor>;
type EntityArrayResponseType = HttpResponse<IEyeColor[]>;

@Injectable({
    providedIn: 'root'
})
export class EyeColorService {

    private readonly resourceUrl: string = '/profile-questions/eye-colors';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
