import {AfterContentInit, Component, Inject, Injector, OnDestroy, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {SystemConfigService} from './services/system-config.service';
import {GeneralConfig, IGeneralConfig} from './model/system-config.model';
import {CometChatService} from './services/comet-chat.service';
import {TokenService} from './services/token.service';
import {AddcellService} from './services/addcell.service';
import {BnNgIdleService} from 'bn-ng-idle';
import {Socket} from 'ngx-socket-io';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy, AfterContentInit {
    public generalConfig: IGeneralConfig[];
    public model = new GeneralConfig(false);

    public isShowHeaderAndFooter = true;
    private routeSubscription: Subscription;
    public socket: Socket;
    public bnIdle: BnNgIdleService;
    public isPageLoaded = false;
    //public ccService: NgcCookieConsentService;

    public isPlatformReadVar = false;
    public isAuthenticatedVar = false;
    public isRegisterPageVar = false;

    constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any,
                public translateService: TranslateService,
                private renderer2: Renderer2,
                public router: Router,
                private activatedRoute: ActivatedRoute,
                public userService: UserService,
                private tokenService: TokenService,
                private cometChatService: CometChatService,
                @Inject(LOCAL_STORAGE) private localStorage: any,
                private systemConfigService: SystemConfigService,
                private injector: Injector,
                private addcellService: AddcellService,
                private localStorageService: LocalStorageService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.translateService.setDefaultLang('de');
            this.translateService.use('de');
            //this.ccService = this.injector.get(NgcCookieConsentService);
            //this.ccService.init(this.ccService.getConfig());
        }

    }

    ngOnInit(): void {
        this.addcellService.addCellJs();
        this.isAuthenticatedVar = this.isAuthenticated();
        this.isPlatformReadVar = this.isPlatformRead();
        this.isRegisterPageVar = this.isRegisterPage();
        this.routeSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.isPageLoaded = true;
            this.isShowHeaderAndFooter = this.checkShowHeaderAndFooter(event.urlAfterRedirects);
        });

        if (!isPlatformBrowser(this.platformId)) {
            const bases = this.document.getElementsByTagName('base');

            if (bases.length > 0) {
                bases[0].setAttribute('href', environment.baseHref);
            }
        }
        this.isMaintenance();
        if (isPlatformBrowser(this.platformId)) {
            this.socket = this.injector.get<Socket>(Socket);
            this.bnIdle = this.injector.get<BnNgIdleService>(BnNgIdleService);
            this.bnIdle.startWatching(60 * 60).subscribe((isTimedOut: boolean) => {
                if (isTimedOut) {
                    this.socket.emit('offline');
                    this.userService.logout().subscribe();
                    this.userService.loginTime(new Date()).subscribe();
                    this.router.navigate(['/']);
                }
            });
            /**
             this.ccService.popupClose$.subscribe(() => {
                this.ccService.getConfig().autoOpen=false
            });
             **/
        }


        if (!this.localStorageService.retrieve('registerId')) {
            this.userService.getRegisterId().subscribe((result: any) => {
                this.localStorageService.store('registerId', result);
            });
        }
    }

    isAuthenticated() {
        const isAuthenticated = this.userService.getToken() ? true : false;
        return isAuthenticated;
    }

    isRegisterPage() {
        const isRegisterPage = this.router.url === '/start' || this.router.url === '/' || this.router.url === '/registrierung';
        return isRegisterPage;
    }

    checkShowHeaderAndFooter(url) {
        if (url.indexOf('404') >= 0) {
            return false;
        } else {
            return true;
        }
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    isMaintenance() {
        this.systemConfigService.findAll().subscribe((data) => {
            this.generalConfig = data.body;
            this.generalConfig.forEach((result) => {
                this.model.isMaintenance = result.isMaintenance;
            });
        });
    }

    isPlatformRead() {
        return isPlatformBrowser(this.platformId);
    }

    ngAfterContentInit(): void {
        const user = this.tokenService.getPayload();
        if (user) {
            this.cometChatService.login(user._id).subscribe(value => {
                console.log('Login CometChatAgain');
            }, error => {
                console.log('Error Login CometChatAgain');
            });
        }
    }
}
