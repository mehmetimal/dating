import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IHowToFindUs} from '../model/how-to-find-us.model';

type EntityResponseType = HttpResponse<IHowToFindUs>;
type EntityArrayResponseType = HttpResponse<IHowToFindUs[]>;

@Injectable({
    providedIn: 'root'
})
export class HowToFindUsService {

    private readonly resourceUrl: string = '/profile-questions/how-to-find-us';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
