import { Component, OnInit } from '@angular/core';
import {LandingPageSocialMediaService} from '../../services/landing-page-social-media.service';

@Component({
  selector: 'app-landing-page-social-media',
  templateUrl: './landing-page-social-media.component.html'
})
export class LandingPageSocialMediaComponent implements OnInit {

  public data: any;
  public result: any;
  public loading = false;

  constructor(public landingPageService: LandingPageSocialMediaService) {

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
