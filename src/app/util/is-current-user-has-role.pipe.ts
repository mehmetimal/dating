import {Pipe, PipeTransform} from '@angular/core';
import {TokenService} from "../services/token.service";
import {IRole} from "../model/role.model";

@Pipe({
    name: 'isCurrentUserHasRolePipe',
    pure: true
})
export class IsCurrentUserHasRolePipe implements PipeTransform {
    constructor(public tokenService: TokenService) {
    }

    transform(roleName: any): any {
        return this.isCurrentUserHasRolePipe(roleName);
    }

    isCurrentUserHasRolePipe(roleName: any) {
        let result = false;
        const roles: IRole[] = this.tokenService.getPayload().roles;
        if (roles && roles.length > 0) {
            result = roles.filter((role: IRole) => role && role.name === roleName).length > 0 ? true : false;
        }
        return result;
    }
}
