import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private readonly resourceUrl: string = '/messages';

    constructor(private http: HttpClient) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    store(senderId, receiverId, receiverName, message): Observable<any> {
        return this.http.post(this.resourceUrl + '/chat/' + senderId + '/' + receiverId, {
            receiverId,
            receiverName,
            message
        });
    }

    getAll(senderId, receiverId, lastMessageCount): Observable<any> {
        const params = new HttpParams()
            .set('senderId', senderId)
            .append('receiverId', receiverId)
            .append('lastMessageCount', lastMessageCount)
            .append('random', Date.now().toString());
        return this.http.get(this.resourceUrl + '/chat/' + senderId + '/' + receiverId, {params});
    }

    markReceiverMessage(sender, receiver): Observable<any> {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get(this.resourceUrl + '/mark-message/' + sender + '/' + receiver, {params});
    }

    findAllConversionsOfCurrentUser() {
        return this.http.get(this.resourceUrl + '/chat/findAllConversionsOfCurrentUser');
    }

    findAllUnreadMessageOfCurrentUser() {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get(this.resourceUrl + '/chat/currentUserAllUnreadMessage', {observe: 'response', params});
    }

    countOfCurrentUserAllMessage() {
        return this.http.get(this.resourceUrl + '/find/countOfCurrentUserAllMessage', {observe: 'response'});
    }

    findCurrentUserLastMessageSent() {
        return this.http.get(this.resourceUrl + '/find/findCurrentUserLastMessageSent', {observe: 'response'});
    }

}
