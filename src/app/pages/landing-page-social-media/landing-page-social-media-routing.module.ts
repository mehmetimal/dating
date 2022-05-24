import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LandingPageSocialMediaComponent} from './landing-page-social-media.component';


const routes: Routes = [
    {path: '', component: LandingPageSocialMediaComponent, data: {breadcrumb: 'Socialmedia'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingPageSocialMediaRoutingModule {
}
