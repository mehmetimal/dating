import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthenticatedGuard} from '../../util/authenticated.guard';
import {SurveyComponent} from './survey.component';


const routes: Routes = [
    {path: '', component: SurveyComponent, data: {breadcrumb: 'Umfrage'}, canActivate: [AuthenticatedGuard]}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SurveyRoutingModule {
}
