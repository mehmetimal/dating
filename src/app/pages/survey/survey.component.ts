import {Component, OnInit} from '@angular/core';
import {SurveyService} from '../../services/survey.service';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {

    public data: any;

    constructor(public surveyService: SurveyService) {

    }

    ngOnInit() {
        this.get();
    }

    get() {
        this.surveyService.findOne().subscribe((data: any) => {
            const result = data.body.data;
            this.data = result;
        });
    }

}
