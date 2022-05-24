import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserListComponent} from './user-list.component';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';


const routes: Routes = [
    {path: '', component: UserListComponent, data: {breadcrumb: 'Benutzerliste'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserListRoutingModule {
}
