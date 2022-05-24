import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {SettingsComponent} from './settings.component';


const routes: Routes = [
    {path: '', component: SettingsComponent, data: {breadcrumb: 'Einstellungen'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule {
}
