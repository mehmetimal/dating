import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KontaktformularRoutingModule} from './kontaktformular-routing.module';
import {KontaktformularComponent} from './kontaktformular.component';
import {
    RECAPTCHA_LANGUAGE,
    RECAPTCHA_SETTINGS,
    RecaptchaFormsModule,
    RecaptchaModule,
    RecaptchaSettings
} from 'ng-recaptcha';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    declarations: [
        KontaktformularComponent,
    ],
    providers: [
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: '6Le2jeMUAAAAAGry8p_iu_idNmUpJDmwBjd8qp2C'
            } as RecaptchaSettings
        },
        {
            provide: RECAPTCHA_LANGUAGE,
            useValue: 'de'
        }
    ],
    imports: [
        CommonModule,
        KontaktformularRoutingModule,
        SharedModule,
        RecaptchaModule,
        RecaptchaFormsModule
    ],
    exports: [],
    entryComponents: []
})
export class KontaktformularModule {
}
