import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from '../ui/header/header.component';
import {FooterComponent} from '../ui/footer/footer.component';
import {ContentComponent} from '../ui/content/content.component';
import {FooterMenuComponent} from '../ui/footer-menu/footer-menu.component';
import {SafeHtmlPipe} from '../ui/footer-menu/safe-html-pipe.pipe';
import {HeaderLinkComponent} from '../ui/header/header-link/header-link.component';
import {LastVisitorsComponent} from '../pages/user/profile/profile-visitor-modal/last-visitors/last-visitors.component';
import {FavoriteListComponent} from '../pages/user/profile/profile-visitor-modal/favorite-list/favorite-list.component';
import {ProfileVisitorModalComponent} from '../pages/user/profile/profile-visitor-modal/profile-visitor-modal.component';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {SafePipe} from '../util/safe.pipe';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {LoginComponent} from '../ui/header/login/login.component';
import {UserActivatedPopupComponent} from '../ui/header/user-activated-popup/user-activated-popup.component';
import {BreadcrumbComponent} from '../pages/breadcrumb/breadcrumb.component';
import {DetailSearchModalComponent} from '../ui/detail-search-modal/detail-search-modal.component';
import {NgFloorPipeModule, NgOrderByPipeModule, NgRandomPipeModule, NgReplacePipeModule} from 'angular-pipes';
import {ReplaceWithStarPipe} from '../util/replace-with-star.pipe';
import {Ng5SliderModule} from 'ng5-slider';
import {GetImageByIdPipe} from '../util/get-image-by-id.pipe';
import {RandomTextGenerator} from '../util/random-text-generator.pipe';
import {SidebarModule} from 'ng-sidebar';
import {RegisterSlideFilterPipe} from '../util/register-slide-filter.pipe';
import {CalculateAgePipe} from '../util/calculate-age.pipe';
import {IsCurrentUserBlockListPipe} from "../util/is-current-user-block-list.pipe";
import {IsSharedProfileImageWithCurrentUserPipe} from "../util/is-shared-profile-image-with-current-user.pipe";
import {IsCurrentUserHasRolePipe} from "../util/is-current-user-has-role.pipe";
import {NumericDirective} from "../util/numeric.directive";
import {LoadingModalComponent} from '../pages/register/loading-modal.component';
import {LottieModule} from 'ngx-lottie';
import {NewsDetailComponent} from '../pages/news/news-detail/news-detail.component';

@NgModule({
    declarations: [
        BreadcrumbComponent,
        LoginComponent,
        UserActivatedPopupComponent,
        HeaderComponent,
        FooterComponent,
        ContentComponent,
        FooterMenuComponent,
        SafeHtmlPipe,
        SafePipe,
        RegisterSlideFilterPipe,
        ReplaceWithStarPipe,
        HeaderLinkComponent,
        LastVisitorsComponent,
        FavoriteListComponent,
        ProfileVisitorModalComponent,
        DetailSearchModalComponent,
        GetImageByIdPipe,
        RandomTextGenerator,
        CalculateAgePipe,
        IsCurrentUserBlockListPipe,
        IsSharedProfileImageWithCurrentUserPipe,
        IsCurrentUserHasRolePipe,
        NumericDirective,
        LoadingModalComponent,
        NewsDetailComponent
    ],
    providers: [
        NgbActiveModal
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
        TranslateModule.forChild({}),
        NgSelectModule,
        RouterModule,
        NgxWebstorageModule,
        NgRandomPipeModule,
        Ng5SliderModule,
        NgOrderByPipeModule,
        SidebarModule.forRoot(),
        LottieModule
    ],
    exports: [
        BreadcrumbComponent,
        CommonModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        TranslateModule,
        NgSelectModule,
        NgRandomPipeModule,
        NgFloorPipeModule,
        NgReplacePipeModule,
        RouterModule,
        Ng5SliderModule,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        ContentComponent,
        FooterMenuComponent,
        SafeHtmlPipe,
        HeaderLinkComponent,
        LastVisitorsComponent,
        FavoriteListComponent,
        ProfileVisitorModalComponent,
        SafePipe,
        ReplaceWithStarPipe,
        RegisterSlideFilterPipe,
        NgxWebstorageModule,
        UserActivatedPopupComponent,
        DetailSearchModalComponent,
        NgOrderByPipeModule,
        GetImageByIdPipe,
        RandomTextGenerator,
        SidebarModule,
        CalculateAgePipe,
        IsCurrentUserBlockListPipe,
        IsSharedProfileImageWithCurrentUserPipe,
        IsCurrentUserHasRolePipe,
        NumericDirective,
        NewsDetailComponent
    ],
    entryComponents: [LoadingModalComponent]
})
export class SharedModule {
}
