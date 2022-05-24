import {Pipe, PipeTransform} from '@angular/core';
import {TokenService} from "../services/token.service";

@Pipe({
    name: 'isSharedProfileImageWithCurrentUserPipe',
    pure: true
})
export class IsSharedProfileImageWithCurrentUserPipe implements PipeTransform {
    constructor(public tokenService: TokenService) {
    }

    transform(user: any, sharedImagesWithCurrentUser?: any[]): any {
        return this.IsSharedProfileImageWithCurrentUser(user, sharedImagesWithCurrentUser);
    }

    IsSharedProfileImageWithCurrentUser(user: any, sharedImagesWithCurrentUser) {
        const currentUser = this.tokenService.getPayload();
        let sharedUser;
        if (sharedImagesWithCurrentUser && sharedImagesWithCurrentUser.length > 0) {
            sharedUser = sharedImagesWithCurrentUser.find(value => value.toUser === currentUser._id
                && user && user.profileImage && value.image === user.profileImage._id);
        }
        return sharedUser || (user && user.profileImage && user.profileImage.isBlurRemoved) ? true : false;
    }
}
