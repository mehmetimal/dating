import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {UserProfileComponent} from './user-profile.component';


const routes: Routes = [
    {path: '', component: UserProfileComponent, data: {breadcrumb: ''}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule {
}
