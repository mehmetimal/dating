import {Component, OnInit} from '@angular/core';
import {MarketingService} from '../../services/marketing.service';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

    marketingContent;

    constructor(public marketingService: MarketingService) {

    }

    ngOnInit() {
        this.get();
    }

    get() {
        this.marketingService.findOne().subscribe((data: any) => {
            if (data.body && data.body.data && data.body.data.content) {
                const result = data.body.data.content;
                this.marketingContent = result;
            }
        });
    }

}
