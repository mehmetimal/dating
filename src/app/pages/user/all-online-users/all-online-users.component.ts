import {AfterViewInit, Component, Inject, Injector, OnInit, PLATFORM_ID} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import * as moment from 'moment';

import {TokenService} from '../../../services/token.service';

import {IUser, User} from '../../../model/user.model';
import {environment} from '../../../../environments/environment';
import {from} from 'rxjs';
import {distinct, filter, toArray} from 'rxjs/operators';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {SharedImageService} from '../../../services/shared-image.service';
import {ISharedImage} from '../../../model/shared-image.model';
import {AcceptStateEnum} from '../../../model/accept-state.enum';
import {UserService} from '../../../services/user.service';

@Component({
    selector: 'app-all-online-users',
    templateUrl: './all-online-users.component.html',
    styleUrls: ['./all-online-users.component.scss']
})
export class AllOnlineUsersComponent implements OnInit, AfterViewInit {
    public udcFolder = environment.udcFolder;
    users: IUser[];
    loggedUser: any;
    public backendURL = environment.frontendUrl;
    socket: Socket;
    randomEmptyImage: number;
    sharedImagesWithCurrentUser: ISharedImage[];
    public approved = AcceptStateEnum.APPROVED;


    constructor(private injector: Injector,
                private router: Router,
                private sharedImageService: SharedImageService,
                @Inject(PLATFORM_ID) private platformId: any,
                private tokenService: TokenService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.sharedImagesWithCurrentUser = [];
        this.findAllSharedImagesWithCurrentUser();
        this.randomEmptyImage = Math.floor(Math.random() * 3) + 1;
        this.loggedUser = this.tokenService.getPayload();
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            const userSocket = new User();
            userSocket._id = this.loggedUser._id;
            userSocket.gender = this.loggedUser.gender;
            userSocket.searchGender = this.loggedUser.searchGender;
            userSocket.profileImage = this.loggedUser.profileImage;
            userSocket.profileName = this.loggedUser.profileName;
            userSocket.birthday = this.calculateAge(this.loggedUser.birthday);
            userSocket.clubNumber = this.loggedUser.clubNumber;
            userSocket.randomNumber = this.loggedUser.randomNumber;
            this.socket.emit('online', {
                room: 'global',
                user: userSocket
            });

            this.socket.emit('disconnect', {
                room: 'global',
                user: userSocket
            });
        }

    }

    ngAfterViewInit(): void {
        const currentUser = this.tokenService.getPayload();
        const currentUserGender = currentUser.gender;
        const currentUserSearchGender = currentUser.searchGender;

        if (isPlatformBrowser(this.platformId)) {
            this.userService.getAllLoginTimeUser().subscribe((result: any) => {
                const a = result.body.filter((value: any) => {
                    value = value.user;
                    if (currentUserGender.name === 'Male' || currentUserGender.name === 'Female') {
                        return (value._id !== currentUser._id) && (value.gender._id === currentUserSearchGender._id) && (value.searchGender._id === currentUserGender._id || value.searchGender.name === 'Couple');
                    } else {
                        return value._id !== currentUser._id && value.gender._id === currentUserSearchGender._id && value.searchGender._id === currentUserGender._id;
                    }
                });
                if (!this.users) {
                    this.users = [];
                }
                a.forEach(data => {
                    this.users.push(data.user);
                });
            });
            /*            this.socket.on('usersOnline', data => {
                            from(data)
                                .pipe(
                                    distinct((value: IUser) => value._id),
                                    filter(value => {
                                        if(currentUserGender.name === 'Male' || currentUserGender.name === 'Female') {
                                            return (value._id !== currentUser._id) && (value.gender._id === currentUserSearchGender._id) && (value.searchGender._id === currentUserGender._id || value.searchGender.name === 'Couple');
                                        } else {
                                            return value._id !== currentUser._id && value.gender._id === currentUserSearchGender._id && value.searchGender._id === currentUserGender._id;
                                        }
                                    }),
                                    toArray()
                                ).subscribe((res: any) => {
                                this.users = res;
                            });
                        });*/
        }

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

    isCurrentUserBlockList(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let blockListUser;
        if (user.blockUserList && user.blockUserList.length > 0) {
            blockListUser = user.blockUserList.find(value => value._id === currentUser._id);
        }
        return blockListUser ? true : false;
    }

    isSharedProfileImageWithCurrentUser(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let sharedUser;
        if (this.sharedImagesWithCurrentUser && this.sharedImagesWithCurrentUser.length > 0) {
            sharedUser = this.sharedImagesWithCurrentUser.find(value => value.toUser === currentUser._id
                && user && user.profileImage && value.image === user.profileImage._id);
        }
        return sharedUser || (user && user.profileImage && user.profileImage.isBlurRemoved) ? true : false;
    }

    goToMessage(user) {
        const convertUser = JSON.stringify(user);
        this.router.navigateByUrl('/messages', {state: {data: convertUser}});
    }

    findAllSharedImagesWithCurrentUser() {
        this.sharedImageService.findAllSharedImagesWithCurrentUser().subscribe((value: any) => {
            this.sharedImagesWithCurrentUser = value.body;
        });
    }
}
