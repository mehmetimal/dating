import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NewsComponent} from './news.component';
import {NewsRoutingModule} from './news-routing.module';
import { NewsSidemenuComponent } from './news-sidemenu/news-sidemenu.component';

@NgModule({
    declarations: [
        NewsComponent,
        NewsSidemenuComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        NewsRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class NewsModule {
}
