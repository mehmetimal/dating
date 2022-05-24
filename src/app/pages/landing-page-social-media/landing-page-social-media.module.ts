import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {LandingPageSocialMediaComponent} from './landing-page-social-media.component';
import {LandingPageSocialMediaRoutingModule} from './landing-page-social-media-routing.module';

@NgModule({
    declarations: [
        LandingPageSocialMediaComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        LandingPageSocialMediaRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class LandingPageSocialMediaModule {
}
