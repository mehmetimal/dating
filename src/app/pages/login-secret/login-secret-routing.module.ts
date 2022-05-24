import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoginSecretComponent} from './login-secret.component';


const routes: Routes = [
    {path: '', component: LoginSecretComponent, data: {breadcrumb: 'Anmeldung'}}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoginSecretRoutingModule {
}
