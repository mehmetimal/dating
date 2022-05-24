import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailPageRoutingModule} from './detail-page-routing.module';
import {DetailPageComponent} from './detail-page.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [
        DetailPageComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        DetailPageRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class DetailPageModule {
}
