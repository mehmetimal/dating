import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllOnlineUsersComponent} from './all-online-users.component';
import {AllOnlineUsersRoutingModule} from './all-online-users-routing.module';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [
        AllOnlineUsersComponent,
    ],
    providers: [],
    imports: [
        CommonModule,
        AllOnlineUsersRoutingModule,
        SharedModule,
    ],
    exports: [],
    entryComponents: []
})
export class AllOnlineUsersModule {
}
