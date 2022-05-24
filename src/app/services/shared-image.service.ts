import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {ISharedImage} from '../model/shared-image.model';

type EntityResponseType = HttpResponse<ISharedImage>;
type EntityArrayResponseType = HttpResponse<ISharedImage[]>;

@Injectable({
    providedIn: 'root'
})
export class SharedImageService {

    private readonly resourceUrl: string = '/shared-image';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    shareImage(shareImage: ISharedImage) {
        return this.http.post<any>(`${this.resourceUrl}/share`, shareImage,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    shareAllGalleryImageAndProfileImage(sharedUser) {
        const data = {
            sharedUser
        };
        return this.http.post<any>(`${this.resourceUrl}/shareAllGalleryImageAndProfileImage`, data,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    unShareAllGalleryImageAndProfileImage(sharedUser) {
        const data = {
            sharedUser
        };
        return this.http.post<any>(`${this.resourceUrl}/unShareAllGalleryImageAndProfileImage`, data,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    unShareImage(shareImage: ISharedImage) {
        return this.http.post<any>(`${this.resourceUrl}/unshare`, shareImage,
            {observe: 'response'}).pipe(map((res: HttpResponse<any>) => res));
    }

    findAllByImageAndFromUser(userId: string, imageId: string) {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get<any>(`${this.resourceUrl}/findAllByImageAndFromUser/` + userId + '/' + imageId,
            {observe: 'response', params}).pipe(map((res: HttpResponse<any>) => res));
    }

    findImageSharedToUser(fromUserId: string) {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get<any>(`${this.resourceUrl}/findImageSharedToUser/` + fromUserId,
            {observe: 'response', params}).pipe(map((res: HttpResponse<any>) => res));
    }

    findAllSharedImagesWithCurrentUser() {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get<any>(`${this.resourceUrl}/findAllSharedImagesWithCurrentUser`,
            {observe: 'response', params}).pipe(map((res: HttpResponse<any>) => res));

    }
}
