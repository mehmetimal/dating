import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {UiModule} from './ui/ui.module';
import {PagesModule} from './pages/pages.module';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {AuthInterceptor} from './util/auth.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {CommonModule, registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {AuthExpiredInterceptor} from './util/auth-expired-interceptor';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {NgtUniversalModule} from '@ng-toolkit/universal';
import {MaintenanceComponent} from './pages/maintenance/maintenance.component';
import {SharedModule} from './shared/shared.module';
import {BnNgIdleService} from 'bn-ng-idle';

registerLocaleData(localeDe, 'de');

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/langs/', '.json');
}
const config: SocketIoConfig = {url: environment.socketUrl, options: {}};

@NgModule({
    declarations: [
        AppComponent,
        MaintenanceComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        PagesModule,
        SharedModule,
        UiModule,
        NgbModule,
        NgbModalModule,
        NgxWebstorageModule.forRoot({prefix: 'dating', separator: '-'}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        SocketIoModule.forRoot(config),
        CommonModule,
        TransferHttpCacheModule,
        NgtUniversalModule,
        BrowserTransferStateModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID, useValue: 'de'
        },
        BnNgIdleService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
