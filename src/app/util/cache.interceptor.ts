import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const httpRequest = req.clone();
        httpRequest.headers.append('Cache-Control', 'no-cache');
        httpRequest.headers.append('Pragma', 'no-cache');
        httpRequest.headers.append('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');

        return next.handle(httpRequest);
    }
}
