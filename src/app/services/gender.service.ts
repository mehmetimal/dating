import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IGender} from '../model/gender.model';

type EntityResponseType = HttpResponse<IGender>;
type EntityArrayResponseType = HttpResponse<IGender[]>;

@Injectable({
    providedIn: 'root'
})
export class GenderService {

    private readonly resourceUrl: string = '/profile-questions/gender';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }

    findById(id) {
        const url  = environment.url + '/gender';
        return this.http.get(url + '/' + id, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }
}
