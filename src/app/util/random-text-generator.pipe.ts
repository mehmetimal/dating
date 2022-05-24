import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from "../services/user.service";

@Pipe({
    name: 'randomText'
})
export class RandomTextGenerator implements PipeTransform {

    constructor(private userService: UserService) {
    }

    public transform(value): any {
        if (!this.userService.isCurrentUserHasRole('ROLE_PREMIUM') && value && value.length) {
            const length = value.length;
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        } else {
            return value;
        }
    }
}
