import { Component, OnInit } from '@angular/core';
import {FaqService} from '../../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  public data: any;
  public result: any;
  public loading = false;

  constructor(public faqSevicer: FaqService) {

  }

  ngOnInit() {
    this.loading = false;
    this.get();
  }

  get() {
    this.faqSevicer.findOne().subscribe((data: any) => {
      this.result = data.body.data;
      this.data = this.result;
      this.loading = true;
    });
  }

}
