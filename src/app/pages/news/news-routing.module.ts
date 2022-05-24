import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {NewsComponent} from './news.component';
import {AuthenticatedGuard} from '../../util/authenticated.guard';
import {NewsGuard} from '../../util/news.guard';
import {NewsDetailComponent} from "./news-detail/news-detail.component";


const routes: Routes = [
    {path: '', component: NewsComponent, data: {breadcrumb: 'Nachrichten'}, canActivate: [NewsGuard]},
    {path: ':id', component: NewsDetailComponent, data: {breadcrumb: 'Nachrichten'}, canActivate: [NewsGuard]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsRoutingModule {
}
