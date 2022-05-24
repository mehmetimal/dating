import {Component, Input, OnInit} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profile-club-statistics-modal',
    templateUrl: './profile-club-statistics-modal.component.html',
    styleUrls: ['./profile-club-statistics-modal.component.scss']
})
export class ProfileClubStatisticsModalComponent implements OnInit {
    @Input() ngbModalRef: NgbModalRef;
    @Input() totalLikeCount;
    @Input() user;
    @Input() messageCount;
    public single = [
        {
            'name': 'AUFRUFE',
            'series': [
                {
                    'name': 'AUFRUFE',
                    'value': 0
                }
            ]
        },

        {
            'name': 'LIKE',
            'series': [
                {
                    'name': 'LIKE',
                    'value': 0
                }
            ]
        },

        {
            'name': 'NACHRICHTEN',
            'series': [
                {
                    'name': 'NACHRICHTEN',
                    'value': 0
                }
            ]
        }
    ];
    public isOverview: boolean;
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    tooltipDisabled = true;
    legendTitle: '';
    view = [300, 300];

    colorScheme = {
        domain: ['#ED3C64', '#66CCCC']
    };

    constructor() {
    }

    ngOnInit() {
        this.single[0].series[0].value = this.user ? this.user.viewCount : 0;
        this.single[1].series[0].value = this.totalLikeCount ? this.totalLikeCount : 0;
        this.single[2].series[0].value = this.messageCount ? this.messageCount : 0;
        this.isOverview = true;
    }

    onSelect(event) {
    }

    changeOverviewState(value: boolean) {
        this.isOverview = value;
    }

    closeModal() {
        this.ngbModalRef.close();
    }


}
