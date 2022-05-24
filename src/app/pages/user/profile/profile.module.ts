import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ImageCropperModule} from 'ngx-image-cropper';
import {BarChartModule} from '@swimlane/ngx-charts';
import {ImageGalleryComponent} from './image-gallery/image-gallery.component';
import {ProfileImageComponent} from './profile-image/profile-image.component';
import {ProfileBackgroundImageComponent} from './profile-background-image/profile-background-image.component';
import {ProfileStatisticsModalComponent} from './profile-statistics-modal/profile-statistics-modal.component';
import {ProfileMenuLinksComponent} from './profile-menu-links/profile-menu-links.component';
import {ProfileCardComponent} from './profile-card/profile-card.component';
import {ProfileAboutCardComponent} from './profile-about-card/profile-about-card.component';
import {ProfileImageGalleryComponent} from './profile-image-gallery/profile-image-gallery.component';
import {ProfileClubStatisticsModalComponent} from './profile-club-statistics-modal/profile-club-statistics-modal.component';
import {ProfileStatusCardComponent} from './profile-status-card/profile-status-card.component';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import { ProfileFeatureCardComponent } from './profile-feature-card/profile-feature-card.component';
import {TruncateModule} from 'ng2-truncate';

@NgModule({
    declarations: [
        ProfileComponent,
        ImageGalleryComponent,
        ProfileImageComponent,
        ProfileBackgroundImageComponent,
        ProfileStatisticsModalComponent,
        ProfileMenuLinksComponent,
        ProfileCardComponent,
        ProfileAboutCardComponent,
        ProfileImageGalleryComponent,
        ProfileClubStatisticsModalComponent,
        ProfileStatusCardComponent,
        ProfileFeatureCardComponent,
    ],
    providers: [
        NgbActiveModal
    ],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        ImageCropperModule,
        BarChartModule,
        SharedModule,
        TruncateModule
    ],
    exports: [],
    entryComponents: []
})
export class ProfileModule {
}
