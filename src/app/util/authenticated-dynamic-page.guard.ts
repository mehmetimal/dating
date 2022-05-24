import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {UserService} from '../services/user.service';
import {FooterLinkService} from '../services/footer-link.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthenticatedDynamicPageGuard implements CanActivate {
    title: string;

    constructor(private userService: UserService, private route: ActivatedRoute, private footerLinkService: FooterLinkService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.title = route.paramMap.get('title');
        this.title = this.title === 'Datenschutzerklaerung' ? 'Datenschutzerklärung' : this.title;
        return this.footerLinkService.footerLinkGetIdTitle(this.title).pipe(
            map((data: any) => {
                if (data && data.data && data.data !== null) {
                    const checkResult = this.checkFooterIsLogin(data.data.isLogin);
                    if (checkResult) {
                        return true;
                    } else {
                        this.router.navigate(['/']);
                    }
                } else {
                    this.router.navigate(['/404']);
                }

            })
        );
    }

    async checkFooterIsLogin(isLogin) {
        if (isLogin) {
            return await this.isAuthenticated();
        } else {
            return true;
        }
    }

    async isAuthenticated() {
        const isAuthenticated = await this.userService.getToken() ? true : false;
        return isAuthenticated;
    }


}
