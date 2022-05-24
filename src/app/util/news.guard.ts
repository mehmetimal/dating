import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {SystemConfigService} from '../services/system-config.service';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class NewsGuard implements CanActivate {

    constructor(private systemConfigService: SystemConfigService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        // const roleChecked = this.userService.isCurrentUserHasRole('ROLE_PREMIUM');
        return this.systemConfigService.findAll().pipe(
            map((data: any) => {
                const result = !!data.body[0].isNews;
                if (result) {
                    return true;
                } else {
                   //this.router.navigateByUrl('/profile');
                    return true;
                }
            })
        );
    }


}
