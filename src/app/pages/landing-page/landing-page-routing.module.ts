import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LandingPageComponent} from './landing-page.component';


const routes: Routes = [
    {path: '', component: LandingPageComponent, data: {breadcrumb: 'TV'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LandingPageRoutingModule {
}
