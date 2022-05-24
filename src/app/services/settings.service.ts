import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ISettings} from '../model/settings.model';
import {environment} from '../../environments/environment';

type EntityResponseType = HttpResponse<ISettings>;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly resourceUrl: string = '/settings';

  constructor(private http: HttpClient) {
    this.resourceUrl = environment.url + this.resourceUrl;
  }

  findOne(): Observable<EntityResponseType> {
    return this.http.get(this.resourceUrl, {observe: 'response'})
      .pipe(map((res: EntityResponseType) => res));
  }

  create(settings: ISettings): Observable<EntityResponseType> {
    return this.http
      .post<ISettings>(`${this.resourceUrl}`, settings, {observe: 'response'})
      .pipe(map((res: EntityResponseType) => res));
  }

  update(settings: ISettings): Observable<EntityResponseType> {
    return this.http
      .put<ISettings>(`${this.resourceUrl}`, settings, {observe: 'response'})
      .pipe(map((res: EntityResponseType) => res));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
      observe: 'response'
    });
  }

}
