import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ErrorPageComponent} from './error-page.component';
import {ErrorPageRoutingModule} from './error-page-routing.module';

@NgModule({
    declarations: [
        ErrorPageComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        ErrorPageRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class ErrorPageModule {
}
