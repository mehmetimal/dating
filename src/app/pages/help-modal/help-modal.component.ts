import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {HelpModalService} from '../../services/help-modal.service';

@Component({
    selector: 'app-help-modal',
    templateUrl: './help-modal.component.html',
    styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent implements OnInit {
    public title = '';
    public data = '';

    constructor(private route: ActivatedRoute,
                private helpModalService: HelpModalService,
                private router: Router) {
        this.route.params.subscribe(params => {
            this.title = params.title;
            this.get();
        });
    }

    ngOnInit() {
    }

    get() {
        this.helpModalService.helpModalGetIdTitle(this.title).subscribe(data => {
            if (data['data'] === null) {
                this.router.navigateByUrl('/404');
            } else {
                this.data = data['data']['content'];
            }

        });
    }
}
