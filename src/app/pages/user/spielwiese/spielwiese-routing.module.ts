import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedGuard} from '../../../util/authenticated.guard';
import {NgModule} from '@angular/core';
import {SpielwieseComponent} from './spielwiese.component';


const routes: Routes = [
    {path: '', component: SpielwieseComponent, data: {breadcrumb: 'Eisdiele'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpielwieseRoutingModule {
}
