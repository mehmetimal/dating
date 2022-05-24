import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {WINDOW} from '@ng-toolkit/universal';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(@Inject(WINDOW) private window: Window,
              @Inject(PLATFORM_ID) private platformId: any,
              private $localStorage: LocalStorageService,
              private $sessionStorage: SessionStorageService,
  ) {
  }

  getPayload() {
    const token = this.$sessionStorage.retrieve('authenticationToken')
        || this.$localStorage.retrieve('authenticationToken');
    let payload;
    if (token) {
      payload = token.split('.')[1];
      if (isPlatformBrowser(this.platformId)) {
        payload = JSON.parse(this.window.atob(payload));
      }
    }
    return payload ? payload.data : null;
  }
}
