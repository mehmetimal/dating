import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IImage} from '../model/image.model';

type EntityResponseType = HttpResponse<IImage>;
type EntityArrayResponseType = HttpResponse<IImage[]>;

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private readonly resourceUrl: string = '/images';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    likeProfileImage(imageId: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/profile/image/like/${imageId}`,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    unLikeProfileImage(imageId: any): Observable<any> {
        return this.http.post<any>(`${this.resourceUrl}/profile/image/unlike/${imageId}`,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    findById(id, isBlur): Observable<EntityResponseType> {
        return this.http.get(this.resourceUrl + '/find-by-id/' + id + '/' + isBlur, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

}
