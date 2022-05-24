import {Component, OnInit} from '@angular/core';
import {FooterLinkService} from '../../../services/footer-link.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-detail-page',
    templateUrl: './detail-page.component.html'
})
export class DetailPageComponent implements OnInit {

    public title: string;
    public data: any;

    constructor(public footerLinkService: FooterLinkService,
                private route: ActivatedRoute,
                private router: Router) {
        this.route.params.subscribe(params => {
            this.title = params['title'];
            this.title = this.title === 'Datenschutzerklaerung' ? 'Datenschutzerklärung' : this.title;
            this.get();
        });
    }

    ngOnInit() {
    }

    get() {
        this.footerLinkService.footerLinkGetIdTitle(this.title).subscribe(data => {
            if (data['data'] === null) {
                this.router.navigateByUrl('/404');
            } else {
                this.data = data['data']['content'];
            }

        });
    }

}
