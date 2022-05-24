import {Inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {Socket} from 'ngx-socket-io';
import {isPlatformBrowser, Location} from '@angular/common';
import {TokenService} from '../services/token.service';
import {CometChatService} from '../services/comet-chat.service';
import {User} from '../model/user.model';
import * as moment from 'moment';


@Injectable({providedIn: 'root'})
export class AuthenticatedGuard implements CanActivate {
    socket: Socket;

    constructor(private userService: UserService,
                @Inject(PLATFORM_ID) private platformId: any,
                private injector: Injector,
                private tokenService: TokenService,
                private cometChatService: CometChatService,
                private router: Router,
                private location: Location) {

        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
        }
    }

    canActivate(): boolean {
        const isAuthenticated = this.userService.getToken() ? true : false;
        if (!isAuthenticated) {
            this.router.navigate(['/']);
            return false;
        }

        if (isPlatformBrowser(this.platformId)) {
            const userSocket = new User();
            const loginUser = this.tokenService.getPayload();
            userSocket._id = loginUser._id;
            userSocket.gender = loginUser.gender;
            userSocket.searchGender = loginUser.searchGender;
            userSocket.profileImage = loginUser.profileImage;
            userSocket.profileName = loginUser.profileName;
            userSocket.birthday = this.calculateAge(loginUser.birthday);
            userSocket.clubNumber = loginUser.clubNumber;
            userSocket.randomNumber = loginUser.randomNumber;
            this.socket.emit('online', {
                room: 'global',
                user: userSocket
            });
        }
        return true;
    }

    calculateAge(birthday) {
        if (birthday) {
            const date1 = moment(birthday);
            const date2 = moment();
            return date2.diff(date1, 'years');
        } else {
            return null;
        }
    }


}
