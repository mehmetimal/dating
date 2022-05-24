import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {HelpModalComponent} from './help-modal.component';
import {HelpModalRoutingModule} from './help-modal-routing.module';

@NgModule({
    declarations: [
        HelpModalComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        HelpModalRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class HelpModalModule {
}
