import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {IProfileQuestion} from '../model/profile-question.model';
import {environment} from '../../environments/environment';


type EntityArrayResponseType = HttpResponse<IProfileQuestion[]>;
type EntityResponseType = HttpResponse<IProfileQuestion>;

@Injectable({
  providedIn: 'root'
})
export class ProfileQuestionService {

  private readonly resourceUrl: string = '/profile-questions/profile-question';

  constructor(private http: HttpClient) {
    this.resourceUrl = environment.url + this.resourceUrl;
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get(this.resourceUrl, {observe: 'response'})
      .pipe(map((res: EntityArrayResponseType) => res));
  }

  findOneByTypeId(id: any) {
    return this.http.get(`${this.resourceUrl}/${id}`, {observe: 'response'})
      .pipe(
        filter((response: any) => response.ok),
        map((res: EntityResponseType) => res.body));
  }

}
