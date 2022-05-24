import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SpielwieseComponent} from './spielwiese.component';
import {SpielwieseRoutingModule} from './spielwiese-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {SurveyModule} from '../../survey/survey.module';

@NgModule({
    declarations: [
        SpielwieseComponent
    ],
    providers: [
        NgbActiveModal
    ],
    imports: [
        CommonModule,
        SpielwieseRoutingModule,
        SharedModule,
        SurveyModule
    ],
    exports: [],
    entryComponents: []
})
export class SpielwieseModule {
}
