import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile.component';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {NgModule} from '@angular/core';


const routes: Routes = [
    {path: '', component: ProfileComponent, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {
}
