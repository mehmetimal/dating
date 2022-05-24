import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListRoutingModule} from './user-list-routing.module';
import {UserListComponent} from './user-list.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [
        UserListComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        UserListRoutingModule,
        SharedModule
    ],
    exports: [],
    entryComponents: []
})
export class UserListModule {
}
