import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IRegisterPageImage} from '../model/register-page-image.model';

type EntityResponseType = HttpResponse<IRegisterPageImage>;
type EntityArrayResponseType = HttpResponse<IRegisterPageImage[]>;

@Injectable({
    providedIn: 'root'
})
export class RegisterPageImageService {

    private readonly resourceUrl: string = '/register-page-image';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
