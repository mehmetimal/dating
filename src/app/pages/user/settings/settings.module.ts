import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';

@NgModule({
    declarations: [
        SettingsComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class SettingsModule {
}
