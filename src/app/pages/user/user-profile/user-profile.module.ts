import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {UserProfileComponent} from './user-profile.component';
import {UserProfileRoutingModule} from './user-profile-routing.module';
import {FileUploadModule} from 'ng2-file-upload';
import {TruncateModule} from 'ng2-truncate';

@NgModule({
    declarations: [
        UserProfileComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        UserProfileRoutingModule,
        SharedModule,
        FileUploadModule,
        TruncateModule
    ],
    exports: [],
    entryComponents: []
})
export class UserProfileModule {
}
