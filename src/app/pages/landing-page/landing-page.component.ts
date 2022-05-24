import {Component, OnInit} from '@angular/core';
import {LandingPageService} from '../../services/landing-page.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {

    public data: any;
    public result: any;
    public loading = false;

    constructor(public landingPageService: LandingPageService) {

    }

    ngOnInit() {
        this.loading = false;
        this.get();
    }

    get() {
        this.landingPageService.findOne().subscribe((data: any) => {
            this.result = data.body.data;
            this.data = this.result;
            this.loading = true;
        });
    }
}
