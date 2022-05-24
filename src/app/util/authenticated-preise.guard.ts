import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserService} from '../services/user.service';
import {FooterLinkService} from '../services/footer-link.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthenticatedPreiseGuard implements CanActivate {

    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private footerLinkService: FooterLinkService,
                private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.footerLinkService.footerLinkGetIdTitle('preise').pipe(
            map((data: any) => {
                if (data.data && data.data !== null) {
                    const checkResult = this.checkFooterIsLogin(data.data.isLogin);
                    if (checkResult) {
                        const isRolePremium = this.userService.isCurrentUserHasRole('ROLE_PREMIUM');
                        if (isRolePremium) {
                            this.router.navigate(['/profile']);
                        } else {
                            return true;
                        }
                    } else {
                        this.router.navigate(['/']);
                    }
                } else {
                    this.router.navigate(['/404']);
                }

            })
        );
    }

    checkFooterIsLogin(isLogin) {
        if (isLogin) {
            return this.isAuthenticated();
        } else {
            return true;
        }
    }

    isAuthenticated() {
        const isAuthenticated = this.userService.getToken() ? true : false;
        return isAuthenticated;
    }


}
