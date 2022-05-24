import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurveyComponent} from './survey.component';
import {SurveyRoutingModule} from './survey-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    declarations: [
        SurveyComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        SurveyRoutingModule,
        SharedModule
    ],
    exports: [
        SurveyComponent
    ],
    entryComponents: []
})
export class SurveyModule {
}
