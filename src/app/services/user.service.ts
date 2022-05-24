import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {IUser} from '../model/user.model';
import {filter, map, switchMap} from 'rxjs/operators';
import {Observable, timer} from 'rxjs';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {environment} from '../../environments/environment';
import {TokenService} from './token.service';
import {HobbyAnswerType} from '../model/hobby-answer-type.enum';
import {IFavoriteUser} from '../model/favorite-user.model';
import {IRole} from '../model/role.model';
import {AddcellService} from './addcell.service';

type EntityResponseType = HttpResponse<IUser>;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly resourceUrl: string = '/user';

    constructor(private http: HttpClient,
                private $localStorage: LocalStorageService,
                private $sessionStorage: SessionStorageService,
                private tokenService: TokenService,
                private addcellService: AddcellService
    ) {
        this.resourceUrl = environment.url + this.resourceUrl;
    }

    /*
    * Von hier aus wird der Anmeldemechanismus des Benutzers gesteuert, die im Backend eingegebenen Informationen gesendet
    *  und das vom Backend zurückgegebene JWT-Token auf dem localStorage gespeichert. Über diesen Token erfolgt
    *  die Kontrolle und Verfolgung des aktiven Nutzers.
    * */
    login(user: IUser): Observable<EntityResponseType> {
        return this.http
            .post<IUser>(`${this.resourceUrl}/login`, user, {observe: 'response'})
            .pipe(
                map(authenticateSuccess.bind(this))
            );

        function authenticateSuccess(resp) {
            const jwt = resp.body.token;
            const userResp = resp.body.user;
            if (jwt) {
                // this.setJwtToLocalStorage(jwt);
                this.storeAuthenticationToken(jwt, userResp);
                return jwt;
            }
        }
    }

    storeAuthenticationToken(jwt, user) {
        // this.tokenService.setToken(jwt);
        if (user.rememberme) {
            this.$localStorage.store('authenticationToken', jwt);
            this.$localStorage.store('user.profileName', user.profileName);
            this.$localStorage.store('user._id', user._id);
        } else {
            this.$sessionStorage.store('authenticationToken', jwt);
            this.$sessionStorage.store('user.profileName', user.profileName);
            this.$sessionStorage.store('user._id', user._id);
        }
    }

    signUp(user: IUser): Observable<EntityResponseType> {
        return this.http
            .post<IUser>(`${this.resourceUrl}/signUp`, user, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    findCurrentUserProfile() {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get(`${this.resourceUrl}/profile`, {observe: 'response', params})
            .pipe(
                filter((response: any) => response.ok),
                map((res: EntityResponseType) => res.body));
    }

    findMessageBlackTabProfile() {
        const params = new HttpParams().set('random', Date.now().toString());
        return this.http.get(`${this.resourceUrl}/messageBlackTabProfile`, {observe: 'response', params})
            .pipe(
                filter((response: any) => response.ok),
                map((res: EntityResponseType) => res.body));
    }

    getToken() {
        return (
            this.$localStorage.retrieve('authenticationToken') ||
            this.$sessionStorage.retrieve('authenticationToken')
        );
    }

    getUserProfileFromStorage() {
        return (
            this.$localStorage.retrieve('user.profileName') ||
            this.$sessionStorage.retrieve('user.profileName')
        );
    }

    logout(): Observable<any> {
        return new Observable(observer => {
            this.$localStorage.clear('authenticationToken');
            this.$sessionStorage.clear('authenticationToken');
            // this.tokenService.deleteToken();
            this.addcellService.addCellJs();
            this.addcellService.addGoogleTagManager();
            observer.complete();
        });
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, {
            observe: 'response'
        });
    }

    deleteProfileImage(id: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrl}/profile/image/${id}`, {
            observe: 'response'
        });
    }

    getAllLoginTimeUser() {
        return this.http.get(`${this.resourceUrl}/all-login-time-user`, {
            observe: 'response'
        });
    }

    isExistProfileName(profileName: string) {
        return timer(2000).pipe(
            switchMap(() => {
                return this.http.get<any>(`${this.resourceUrl}/profileNameExist/${profileName}`);
            })
        );
    }

    profileVisitors(user: IUser) {
        return this.http.post(`${this.resourceUrl}/profileVisitors`, user, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    profileVisitorsUpdate(data: any, user: IUser) {
        return this.http.post(`${this.resourceUrl}/profileVisitorsUpdate`, {data, user}, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    favoriteUser(user: IUser) {
        return this.http.post(`${this.resourceUrl}/favoriteUser`, {user}, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    favoriteUserDelete(favorite: IFavoriteUser) {
        return this.http.post(`${this.resourceUrl}/favoriteDelete`, {favorite}, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    loginTime(loginTime: any): Observable<any> {
        const userId = this.$localStorage.retrieve('user._id');
        return this.http.put<any>(`${this.resourceUrl}/loginTime`, {userId, loginTime});
    }

    getAllCurrentUserFriends(page): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/allCurrentUserFriends`, {observe: 'response', params: {page: page}});
    }

    userImageBlur(trueFalse: boolean): Observable<any> {
        const user = this.$localStorage.retrieve('user._id');
        return this.http.put<any>(`${this.resourceUrl}/imageBlur`, {user, trueFalse});
    }

    galleryImageBlurById(id: string, trueFalse: boolean): Observable<any> {
        return this.http.put<any>(`${this.resourceUrl}/gallery/image/blur`, {id, trueFalse});
    }

    getUserDetail(profileName): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/profileDetail/${profileName}`);
    }

    getUserLockInfo(email): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/lockInformation/${email}`);
    }

    getRegisterId(): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/registerId');
    }

    findUserByEmail(email): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/findUserByEmail/${email}`);
    }

    isEmailExist(email): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/profile/email-check/${email}`);
    }

    updateProfileImage(image): Observable<any> {
        const params = new HttpParams().set('random', Date.now().toString());
        const user = this.$localStorage.retrieve('user._id');
        return this.http.get<any>(`${this.resourceUrl}/profile/image/${user}/${image}`, {params});
    }

    deleteBackgroundProfileImage(id: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrl}/profile/background/image/${id}`, {
            observe: 'response'
        });
    }

    validateRegisterSecondPage(user: IUser) {
        return this.http.post(`${this.resourceUrl}/registerSecondPageValidation`, user, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    validateRegisterThirdPage(user: IUser) {
        return this.http.post(`${this.resourceUrl}/registerThirdPageValidation`, user, {observe: 'response'})
            .pipe(map((res: any) => res));
    }

    updateRegisterInformation(data: any) {
        return this.http
            .put<string>(`${this.resourceUrl}/profile/register-info`, data, {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }

    updateAboutText(aboutText: string) {
        const about = {about: aboutText};
        return this.http
            .put<string>(`${this.resourceUrl}/profile/about`, about, {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }

    updateViewCount(id: string) {
        const about = {id};
        return this.http
            .put<string>(`${this.resourceUrl}/profile/update/view-count`, about, {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }

    updateStatusText(statusText: string) {
        const status = {status: statusText};
        return this.http
            .put<string>(`${this.resourceUrl}/profile/status`, status, {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }

    updateUserHobby(hobby: string, answer: HobbyAnswerType) {
        const body = {hobby, answer};
        return this.http
            .put<string>(`${this.resourceUrl}/profile/hobby`, body, {observe: 'response'})
            .pipe(map((res: any) => res.body));
    }


    getAllUsersByStartWithClubNumber(clubNumber: any) {
        return this.http.get(`${this.resourceUrl}/searchByClubNumber/${clubNumber}`, {observe: 'response'})
            .pipe(
                filter((response: any) => response.ok),
                map((res: any) => res.body.response));
    }

    changeProfileInfo(user: IUser) {
        return this.http
            .put<IUser>(`${this.resourceUrl}/profile/change`, user, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    changePassword(user: IUser) {
        return this.http
            .put<IUser>(`${this.resourceUrl}/password/change`, user, {observe: 'response'})
            .pipe(map((res: EntityResponseType) => res));
    }

    addUserToBlockList(userId) {
        return this.http.post(`${this.resourceUrl}/addUserToBlockList`, {userId});
    }

    holidaysModeActive() {
        return this.http.post(`${this.resourceUrl}/holidays-mode`, {});
    }

    removeUserToBlockList(userId): Observable<any> {
        return this.http.put(`${this.resourceUrl}/removeUserToBlockList`, {userId});
    }

    searchDetailUserByParams(minAgeValue, highAgeValue, features, clubNumber, page, postCode = null, lat = null, lng = null) {
        const obj = {
            minAgeValue,
            highAgeValue,
            features,
            clubNumber,
            postCode,
            page,
            lat,
            lng
        };
        return this.http.post<any>(`${this.resourceUrl}/user-list/searchByFilter`, obj, {
            observe: 'response'
        });

    }

    searchDetailUserByClubNumber(clubNumber) {
        let params = new HttpParams();
        params = params.append('clubNumber', clubNumber);
        return this.http.get<any>(`${this.resourceUrl}/user-list/searchByClubNumber`, {
            observe: 'response',
            params
        });

    }

    activateAccount(_id: string): Observable<any> {
        return this.http.put<any>(`${this.resourceUrl}/activate/account`, {_id},
            {observe: 'response'}).pipe(map((res: EntityResponseType) => res));
    }

    userUnsubscribeStarted(userId: string): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/unsubscribe-started/${userId}`,
            {observe: 'response'}).pipe(map((res: EntityResponseType) => res));
    }

    oneWeekPremiumStarted(userId: string): Observable<any> {
        return this.http.get<any>(`${this.resourceUrl}/one-week-premium-started/${userId}`,
            {observe: 'response'}).pipe(map((res: EntityResponseType) => res));
    }

    isCurrentUserHasRole(roleName): boolean {
        let result = false;
        const roles: IRole[] = this.tokenService.getPayload().roles;
        if (roles && roles.length > 0) {
            result = roles.filter((role: IRole) => role && role.name === roleName).length > 0 ? true : false;
        }
        return result;
    }

    sendPasswordToEmail(email: string): Observable<any> {
        return this.http
            .post<any>(`${this.resourceUrl}/send-password-to-email`, {email}, {observe: 'response'})
            .pipe(map((res: any) => res));
    }


    getTokenAndEmailAndClubNumber(): Observable<any> {
        return this.http.post(`${this.resourceUrl}/get-token`, null);
    }

    addFeatureToCurrentUser(checked, item) {
        return this.http.post(`${this.resourceUrl}/add-feature-to-current-user`, {checked, item});
    }

    countOfCurrentUserGetLikes() {
        return this.http.get(this.resourceUrl + '/find/countOfCurrentUserGetLikes', {observe: 'response'});
    }
}
