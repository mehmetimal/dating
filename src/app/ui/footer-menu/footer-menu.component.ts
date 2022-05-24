import {Component, OnInit} from '@angular/core';
import {FooterLinkService} from '../../services/footer-link.service';
import {UserService} from '../../services/user.service';
import {IYoutubeLink} from '../../model/youtube-link.model';
import {YoutubeLinkService} from '../../services/youtube-link.service';
import {Router} from '@angular/router';
import {IUser} from '../../model/user.model';
import {TokenService} from '../../services/token.service';
import {EmbedVideoService} from "../../services/embed-video.service";

@Component({
    selector: 'app-footer-menu',
    templateUrl: './footer-menu.component.html'
})
export class FooterMenuComponent implements OnInit {

    footerlink: any = [];
    youtubeLink: IYoutubeLink;
    yt_iframe_html: any;
    user: IUser;
    constructor(public footerLinkService: FooterLinkService,
                public userService: UserService,
                public router: Router,
                private youtubeLinkService: YoutubeLinkService,
                private embedService: EmbedVideoService,
                private tokenService: TokenService) {
    }

    ngOnInit() {
        this.get();
        this.user = this.tokenService.getPayload();
    }

    get() {
        this.footerLinkService.footerLinkGet().subscribe((data) => {
            this.footerlink = data;
            this.getYoutubeLink();
        });
    }

    checkFooterIsLogin(isLogin) {
        if (isLogin) {
            return this.isAuthenticated();
        } else {
            return true;
        }
    }

    checkPremium() {
        if (this.isAuthenticated()) {
            return this.userService.isCurrentUserHasRole('ROLE_PREMIUM');
        } else {
            return false;
        }
    }

    getYoutubeLink() {
        this.youtubeLinkService.findOne().subscribe((data: any) => {
            if (data && data.body && data.body.response) {
                const response = data.body.response;
                this.youtubeLink = response;
                const youtubeUrl = response.youtubeLink;
                if (youtubeUrl && youtubeUrl.trim().length > 0) {
                    this.yt_iframe_html = this.embedService.embed(youtubeUrl.trim(), {
                        attr: {height: 300}
                    });
                }
            }
        });
    }

    isAuthenticated() {
        const isAuthenticated = this.userService.getToken() ? true : false;
        return isAuthenticated;
    }

}
