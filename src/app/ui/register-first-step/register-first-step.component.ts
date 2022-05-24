import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {GenderService} from '../../services/gender.service';
import {RegisterPageConfigService} from '../../services/register-page-config.service';
import {Observable, Subscription} from 'rxjs';
import {HttpResponse} from '@angular/common/http';
import {JhiEventManager} from '../../services/event-manager.service';

@Component({
    selector: 'app-register-first-step',
    templateUrl: './register-first-step.component.html'
})
export class RegisterFirstStepComponent implements OnInit, OnDestroy {
    @Input() parentForm: FormGroup;
    @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('registerFirstNextButton', {static: true}) registerFirstNextButton: HTMLButtonElement;
    private initializeSubscribe: Subscription;

    questOptions: any[];
    registerFirstPageText: string;
    registerFirstPageTextState: boolean;

    public questOptions$: Observable<HttpResponse<any[]>>;

    constructor(private eventManager: JhiEventManager,
                private genderService: GenderService,
                private registerPageConfigService: RegisterPageConfigService) {
    }

    ngOnInit() {
        this.initializeForm();
    }

    updateFormValues() {
        this.eventManager.broadcast({
            name: 'register-second-step-form-changed',
            content: this.parentForm.value
        });
        this.stateChange.emit('registerTwo');
    }

    initializeForm() {
        this.questOptions$ = this.genderService.findAll();
        this.initializeSubscribe = this.registerPageConfigService.getRegisterFirstPageConfig().
        subscribe((data: any) => {
            this.registerFirstPageText = data.response.registerFirstPageText;
            this.registerFirstPageTextState = data.response.registerFirstPageTextState;
            const element = document.getElementById('registerFirstNextButton');

            if (data.response.registerNextButtonColor) {
                element.style.setProperty('background-color', data.response.registerNextButtonColor, 'important');
            }

            if (data.response.registerNextButtonTextColor) {
                element.style.setProperty('color', data.response.registerNextButtonTextColor, 'important');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.initializeSubscribe) {
            this.initializeSubscribe.unsubscribe();
        }
    }
}
