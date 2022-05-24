import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {KontaktformularComponent} from './kontaktformular.component';
import {AuthenticatedContactGuard} from '../../util/authenticated-contact.guard';


const routes: Routes = [
    {path: '', component: KontaktformularComponent, data: {breadcrumb: 'Kontaktformular'}, canActivate: [AuthenticatedContactGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KontaktformularRoutingModule {
}
