import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IRelationShipStatus} from '../model/relationship-status.model';

type EntityResponseType = HttpResponse<IRelationShipStatus>;
type EntityArrayResponseType = HttpResponse<IRelationShipStatus[]>;

@Injectable({
    providedIn: 'root'
})
export class RelationshipStatusService {

    private readonly resourceUrl: string = '/profile-questions/relationship-status';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findAll(): Observable<EntityArrayResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityArrayResponseType) => res));
    }
}
