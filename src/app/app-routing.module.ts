import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {NewsGuard} from './util/news.guard';
import {SuccessfulyComponent} from './ui/successfuly/successfuly.component';
import {AuthenticatedGuard} from './util/authenticated.guard';
import {AuthenticatedDynamicPageGuard} from './util/authenticated-dynamic-page.guard';
import {AuthenticatedPreiseGuard} from './util/authenticated-preise.guard';
import {AuthenticatedContactGuard} from './util/authenticated-contact.guard';
import {PaidComponent} from './pages/price/paid/paid.component';
import { CallsComponent } from './pages/user/calls/calls.component';
import {NewsDetailComponent} from './pages/news/news-detail/news-detail.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/start',
        pathMatch: 'full'
    },
    {
        path: 'start',
        pathMatch: 'full',
        component: RegisterComponent,
    },

    {
        path: 'profile',
        loadChildren: () => import('./pages/user/profile/profile.module').then(p => p.ProfileModule),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'clubboard',
        loadChildren: () => import('./pages/user/clubboard/clubboard.module').then(p => p.ClubboardModule),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'eisdiele',
        loadChildren: () => import('./pages/user/spielwiese/spielwiese.module').then(p => p.SpielwieseModule),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'view/:profileName',
        loadChildren: () => import('./pages/user/user-profile/user-profile.module').then(p => p.UserProfileModule),
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'profile/settings',
        loadChildren: () => import('./pages/user/settings/settings.module').then(p => p.SettingsModule),
        canActivate: [AuthenticatedGuard],
    },
    {
        path: 'kontaktformular',
        loadChildren: () => import('./pages/kontaktformular/kontaktformular.module').then(p => p.KontaktformularModule),
        canActivate: [AuthenticatedContactGuard]
    },

    {
        path: 'survey',
        loadChildren: () => import('./pages/survey/survey.module').then(p => p.SurveyModule),
        canActivate: [AuthenticatedGuard]
    },

    {
        path: 'profilsuche',
        loadChildren: () => import('./pages/user/user-list/user-list.module').then(p => p.UserListModule),
        canActivate: [AuthenticatedGuard]
    },

    {
        path: 'messages',
        loadChildren: () => import('./pages/user/messages/messages.module').then(p => p.MessagesModule),
        canActivate: [AuthenticatedGuard]
    },

    {
        path: 'calls/:callId',
        component: CallsComponent,
        canActivate: [AuthenticatedGuard]
    },

    {
        path: 'preise',
        loadChildren: () => import('./pages/price/price.module').then(p => p.PriceModule),
        canActivate: [AuthenticatedGuard]
    },

    {
        path: 'neuigkeiten',
        loadChildren: () => import('./pages/news/news.module').then(p => p.NewsModule)
    },
    {
        path: 'online-users',
        loadChildren: () => import('./pages/user/all-online-users/all-online-users.module').then(p => p.AllOnlineUsersModule),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: 'successfuly.html',
        component: SuccessfulyComponent,
        pathMatch: 'full',
        data: {breadcrumb: 'Successfuly'}
    },
    {
        path: 'activate/account/:userId',
        loadChildren: () => import('./pages/activate-account/activate-account.module').then(p => p.ActivateAccountModule)
    },
    {
        path: '785872384',
        loadChildren: () => import('./pages/login-secret/login-secret.module').then(p => p.LoginSecretModule),
        data: {breadcrumb: 'Anmeldung'}
    },
    {
        path: 'tv',
        loadChildren: () => import('./pages/landing-page/landing-page.module').then(p => p.LandingPageModule),
        data: {breadcrumb: 'TV'}
    },
    {
        path: 'socialmedia',
        loadChildren: () => import('./pages/landing-page-social-media/landing-page-social-media.module')
            .then(p => p.LandingPageSocialMediaModule),
        data: {breadcrumb: 'TV'}
    },
    {
        path: 'faq',
        loadChildren: () => import('./pages/faq/faq.module')
            .then(p => p.FaqModule),
        data: {breadcrumb: 'FAQ'}
    },
    {
        path: 'paid',
        component: PaidComponent,
        pathMatch: 'full'
    },
    {
        path: 'hilfe/:title',
        loadChildren: () => import('./pages/help-modal/help-modal.module').then(p => p.HelpModalModule),
    },
    {
        path: '404',
        loadChildren: () => import('./pages/error-page/error-page.module')
            .then(p => p.ErrorPageModule),
        data: {breadcrumb: ''}
    },
    {
        path: ':title',
        loadChildren: () => import('./ui/footer-menu/detail-page/detail-page.module').then(p => p.DetailPageModule),
        canActivate: [AuthenticatedDynamicPageGuard],
    },
    {
        path: '**',
        redirectTo: '/404',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {  useHash: false, preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
