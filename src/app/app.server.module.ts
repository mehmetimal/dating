import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {LottieServerModule} from 'ngx-lottie/server';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule,
        LottieServerModule.forRoot({
            preloadAnimations: {
                folder: 'dist/browser/assets',
                animations: ['data.json'],
            },
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {
}
