import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
    constructor(private userService: UserService,
                private router: Router,
                private modalService: NgbModal) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => {
                },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401 && this.router.url !== '/785872384' && !this.router.url.includes('/activate/account/')) {
                            this.modalService.dismissAll();
                            this.userService.logout().subscribe();
                            this.userService.loginTime(new Date()).subscribe();
                            this.router.navigate(['/']);
                        }
                    }
                }
            )
        );
    }
}
