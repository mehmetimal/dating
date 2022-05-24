import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {IProfileVisitors} from '../../../../../model/profile-visitors.model';
import {IFavoriteUser} from '../../../../../model/favorite-user.model';
import {Router} from '@angular/router';
import {UserService} from '../../../../../services/user.service';
import * as moment from 'moment';
import {ProfileVisitorService} from '../../../../../services/profile-visitor.service';
import {ISharedImage} from '../../../../../model/shared-image.model';
import {AcceptStateEnum} from '../../../../../model/accept-state.enum';
import {TokenService} from '../../../../../services/token.service';
import {SharedImageService} from '../../../../../services/shared-image.service';
import {IUser} from '../../../../../model/user.model';

@Component({
    selector: 'app-last-visitors',
    templateUrl: './last-visitors.component.html',
    styleUrls: ['./last-visitors.component.scss']
})
export class LastVisitorsComponent implements OnInit {
    public udcFolder = environment.udcFolder;
    public backendURL = environment.url;
    public profileVisitors: IProfileVisitors[];
    public favoriteUser: IFavoriteUser[];
    public selectedFovariteUser: IFavoriteUser;

    sharedImagesWithCurrentUser: ISharedImage[];
    public approved = AcceptStateEnum.APPROVED;

    constructor(private router: Router,
                private userService: UserService,
                private tokenService: TokenService,
                private sharedImageService: SharedImageService,
                private profileVisitorService: ProfileVisitorService
    ) {
    }

    ngOnInit() {
        this.findAllSharedImagesWithCurrentUser();
        this.initaizeForm();
    }

    goToUserProfile(name) {
        document.getElementById('closeModal').click();
        this.router.navigateByUrl(`view/${name}`);
    }

    goToMessage(user) {
        document.getElementById('closeModal').click();
        const convertUser = JSON.stringify(user);
        this.router.navigateByUrl('/messages', {state: {data: convertUser}});

    }

    favoriteUserAdded(user) {
        this.userService.favoriteUser(user).subscribe((data) => {
        });
    }

    favoriteUserDelete() {
        this.userService.favoriteUserDelete(this.selectedFovariteUser).subscribe((data) => {
        });
    }

    initaizeForm() {
        this.profileVisitorService.findProfileVisitorsOfCurrentUser().subscribe((data: any) => {
            this.profileVisitors = data.body.response;
        });
    }

    calculateAge(data) {
        const userResult = data.userId;
        if (userResult && userResult.birthday) {
            const date1 = moment(userResult.birthday);
            const date2 = moment();
            return date2.diff(date1, 'years');
        } else {
            return null;
        }
    }

    isCurrentUserBlockList(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let blockListUser;
        if (user && user.blockUserList && user.blockUserList.length > 0) {
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

    findAllSharedImagesWithCurrentUser() {
        this.sharedImageService.findAllSharedImagesWithCurrentUser().subscribe((value: any) => {
            this.sharedImagesWithCurrentUser = value.body;
        });
    }
}
