import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {YoutubeLinkService} from '../services/youtube-link.service';


@Injectable({providedIn: 'root'})
export class YoutubeLinkGuard implements CanActivate {

    constructor(private youtubeLinkService: YoutubeLinkService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.youtubeLinkService.findOne().pipe(
            map((data: any) => {
                const result = !!data.body.response.isActive;
                if (result) {
                    return true;
                } else {
                    this.router.navigateByUrl('/profile');
                    return false;
                }
            })
        );
    }


}
