import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ActivateAccountComponent} from './activate-account.component';


const routes: Routes = [
    {path: '', component: ActivateAccountComponent, data: {breadcrumb: 'Konto aktivieren'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ActivateAccountRoutingModule {
}
