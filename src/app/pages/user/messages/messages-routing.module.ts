import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MessagesComponent} from './messages.component';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';


const routes: Routes = [
    {path: '', component: MessagesComponent, data: {breadcrumb: 'Mitteilungen'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule {
}
