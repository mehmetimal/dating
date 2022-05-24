import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DeletePostModalComponent} from './delete-post-modal/delete-post-modal.component';
import {PostAddModalComponent} from './post-add-modal/post-add-modal.component';
import {PostDetailModalComponent} from './post-detail-modal/post-detail-modal.component';
import {PostImageModalComponent} from './post-image-modal/post-image-modal.component';
import {PostFilterComponent} from './post-filter/post-filter.component';
import {ClubboardRoutingModule} from './clubboard-routing.module';
import {ClubboardComponent} from './clubboard.component';
import {TruncateModule} from 'ng2-truncate';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [
        ClubboardComponent,
        PostAddModalComponent,
        PostFilterComponent,
        DeletePostModalComponent,
        PostDetailModalComponent,
        PostImageModalComponent
    ],
    providers: [
        NgbActiveModal
    ],
    imports: [
        CommonModule,
        ClubboardRoutingModule,
        SharedModule,
        TruncateModule
    ],
    exports: [],
    entryComponents: [
        DeletePostModalComponent,
        PostDetailModalComponent,
        PostAddModalComponent,
        PostImageModalComponent
    ]
})
export class ClubboardModule {
}
