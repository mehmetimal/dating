import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DetailPageComponent} from './detail-page.component';
import {AuthenticatedDynamicPageGuard} from '../../../util/authenticated-dynamic-page.guard';


const routes: Routes = [
    {path: '', component: DetailPageComponent, data: {breadcrumb: ''},  canActivate: [AuthenticatedDynamicPageGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DetailPageRoutingModule {
}
