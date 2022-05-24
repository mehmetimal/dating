import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {LoginSecretComponent} from './login-secret.component';
import {LoginSecretRoutingModule} from './login-secret-routing.module';

@NgModule({
    declarations: [
        LoginSecretComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        LoginSecretRoutingModule,
        SharedModule
    ],
    exports: [
        LoginSecretComponent
    ],
    entryComponents: []
})
export class LoginSecretModule {
}
