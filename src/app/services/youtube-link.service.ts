import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IYoutubeLink} from '../model/youtube-link.model';
import {environment} from '../../environments/environment';

type EntityResponseType = HttpResponse<IYoutubeLink>;

@Injectable({
    providedIn: 'root'
})
export class YoutubeLinkService {

    private readonly resourceUrl: string = '/youtube-link';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    findOne(): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    create(youtubeLink: IYoutubeLink): Observable<EntityResponseType> {
        return this.http
            .post<IYoutubeLink>(`${this.resourceUrl}`, youtubeLink, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    update(youtubeLink: IYoutubeLink): Observable<EntityResponseType> {
        return this.http
            .put<IYoutubeLink>(`${this.resourceUrl}`, youtubeLink, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }

}
