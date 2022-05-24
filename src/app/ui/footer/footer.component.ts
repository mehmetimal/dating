import {Component, OnInit} from '@angular/core';
import {IFooter} from '../../model/footer.model';
import {FooterService} from '../../services/footer.service';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    footer$: Observable<HttpResponse<IFooter>>;
    currentYear$: Observable<HttpResponse<number>>;
    constructor(private footerService: FooterService) {
    }

    ngOnInit() {
        this.footer$ = this.footerService.findOne();
        this.currentYear$ = this.footerService.getCurrentYear();
    }

}
