import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {MessageUtilService} from '../../../../services/message-util.service';
import {IUser} from '../../../../model/user.model';
import {ISharedImage} from '../../../../model/shared-image.model';
import {TokenService} from '../../../../services/token.service';
import {SharedImageService} from '../../../../services/shared-image.service';
import {AcceptStateEnum} from '../../../../model/accept-state.enum';
import {UserService} from "../../../../services/user.service";

@Component({
    selector: 'app-message-pink-tab-content',
    templateUrl: './message-pink-tab-content.component.html',
    styleUrls: ['./message-pink-tab-content.component.scss']
})
export class MessagePinkTabContentComponent implements OnInit {
    public udcFolder = environment.udcFolder;
    @Input() loggedUser;
    @Input() friendsRedTab;
    @Input() allUnreadMessages;
    public backendURL = environment.url;
    sharedImagesWithCurrentUser: ISharedImage[];
    public approved = AcceptStateEnum.APPROVED;
    public isPremium = false;

    constructor(public messageUtilService: MessageUtilService, private tokenService: TokenService,
                private sharedImageService: SharedImageService,
                private userService: UserService
    ) {
        this.isPremium = userService.isCurrentUserHasRole('ROLE_PREMIUM');
    }

    ngOnInit() {
        this.findAllSharedImagesWithCurrentUser();
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
