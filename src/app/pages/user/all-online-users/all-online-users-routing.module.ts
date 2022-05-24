import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {NgModule} from '@angular/core';
import {AllOnlineUsersComponent} from './all-online-users.component';


const routes: Routes = [
    {path: '', component: AllOnlineUsersComponent, data: {breadcrumb: 'Online Benutzer'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllOnlineUsersRoutingModule {
}
