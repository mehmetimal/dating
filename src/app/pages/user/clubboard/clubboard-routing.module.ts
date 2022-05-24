import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {NgModule} from '@angular/core';
import {ClubboardComponent} from './clubboard.component';


const routes: Routes = [
    {path: '', component: ClubboardComponent, data: {breadcrumb: 'Clubboard'}, canActivate: [AuthenticatedGuard]},
    {path: ':id', component: ClubboardComponent, data: {breadcrumb: 'Clubboard'}, canActivate: [AuthenticatedGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClubboardRoutingModule {
}
