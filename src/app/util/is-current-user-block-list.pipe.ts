import {Pipe, PipeTransform} from '@angular/core';
import {TokenService} from "../services/token.service";

@Pipe({
    name: 'isCurrentUserBlockListPipe',
    pure: true
})
export class IsCurrentUserBlockListPipe implements PipeTransform {
    constructor(public tokenService: TokenService) {
    }

    transform(user: any): any {
        return this.isCurrentUserBlockList(user);
    }

    isCurrentUserBlockList(user: any) {
        if (user) {
            const currentUser = this.tokenService.getPayload();
            let blockListUser;
            if (user.blockUserList && user.blockUserList.length > 0) {
                blockListUser = user.blockUserList.find(value => value._id === currentUser._id);
            }
            return blockListUser ? true : false;
        } else {
            return false;
        }
    }
}
