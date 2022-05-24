import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ActivateAccountRoutingModule} from './activate-account-routing-module';
import {ActivateAccountComponent} from './activate-account.component';
import {LoginSecretModule} from "../login-secret/login-secret.module";

@NgModule({
    declarations: [
        ActivateAccountComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        ActivateAccountRoutingModule,
        SharedModule,
        LoginSecretModule
    ],
    exports: [],
    entryComponents: []
})
export class ActivateAccountModule {
}
