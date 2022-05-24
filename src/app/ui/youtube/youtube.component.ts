import {Component, OnInit} from '@angular/core';
import {YoutubeLinkService} from '../../services/youtube-link.service';
import {EmbedVideoService} from "../../services/embed-video.service";

@Component({
    selector: 'app-youtube',
    templateUrl: './youtube.component.html'
})
export class YoutubeComponent implements OnInit {

    yt_iframe_html: any;

    constructor(
        private embedService: EmbedVideoService,
        private youtubeLinkService: YoutubeLinkService
    ) {
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    initializeForm() {
        this.youtubeLinkService.findOne().subscribe((data: any) => {
            if (data.body.response) {
                const response = data.body.response;
                const youtubeUrl = response.youtubeLink;
                if (youtubeUrl && youtubeUrl.trim().length > 0) {
                    this.yt_iframe_html = this.embedService.embed(youtubeUrl.trim(), {
                        attr: {height: 300}
                    });
                }
            }
        });
    }

}
