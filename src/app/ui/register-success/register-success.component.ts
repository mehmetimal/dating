import {AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {GenderService} from '../../services/gender.service';
import {DOCUMENT} from '@angular/common';

@Component({
    selector: 'app-register-success',
    templateUrl: './register-success.component.html'
})
export class RegisterSuccessComponent implements AfterViewInit, OnDestroy {
    @Input() parentForm;
    public scriptTag;
    public noScriptTag;

    constructor(private genderService: GenderService,
                @Inject(DOCUMENT) private document,
                private elementRef: ElementRef,
                @Inject(PLATFORM_ID) private platformId: any) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngAfterViewInit(): void {
        const userId = this.parentForm.value.id;
        const gender = this.parentForm.value.gender;
        const clubNumber = this.parentForm.value.clubNumber;
        this.genderService.findById(gender).subscribe((result: any) => {
            const res = result.body.response;
            if (res.name === 'Female') {
                this.scriptTag = document.createElement('script');
                this.scriptTag.type = 'text/javascript';
                this.scriptTag.src = 'https://t.adcell.com/t/track.js?pid=7399&eventid=10215&referenz=' + clubNumber;
                document.body.appendChild(this.scriptTag);

                this.noScriptTag = document.createElement('noscript');
                const image = document.createElement('image');
                image.setAttribute('border', '0');
                image.setAttribute('width', '1');
                image.setAttribute('height', '1');
                image.setAttribute('src',
                    'https://t.adcell.com/t/track?pid=7399&eventid=10215&referenz=' + clubNumber);

                this.noScriptTag.appendChild(image);
                document.body.appendChild(this.noScriptTag);
            } else if (res.name === 'Male') {
                this.scriptTag = document.createElement('script');
                this.scriptTag.type = 'text/javascript';
                this.scriptTag.src = 'https://t.adcell.com/t/track.js?pid=7399&eventid=10216&referenz=' + clubNumber;
                document.body.appendChild(this.scriptTag);

                this.noScriptTag = document.createElement('noscript');
                const image = document.createElement('image');
                image.setAttribute('border', '0');
                image.setAttribute('width', '1');
                image.setAttribute('height', '1');
                image.setAttribute('src',
                    'https://t.adcell.com/t/track?pid=7399&eventid=10216&referenz=' + clubNumber);

                this.noScriptTag.appendChild(image);
                document.body.appendChild(this.noScriptTag);
            } else if (res.name === 'Couple') {
                this.scriptTag = document.createElement('script');
                this.scriptTag.type = 'text/javascript';
                this.scriptTag.src = 'https://t.adcell.com/t/track.js?pid=7399&eventid=10280&referenz=' + clubNumber;
                document.body.appendChild(this.scriptTag);

                this.noScriptTag = document.createElement('noscript');
                const image = document.createElement('image');
                image.setAttribute('border', '0');
                image.setAttribute('width', '1');
                image.setAttribute('height', '1');
                image.setAttribute('src',
                    'https://t.adcell.com/t/track?pid=7399&eventid=10280&referenz=' + clubNumber);

                this.noScriptTag.appendChild(image);
                document.body.appendChild(this.noScriptTag);
            }
        });
    }

    ngOnDestroy(): void {
        document.body.removeChild(this.scriptTag);
        document.body.removeChild(this.noScriptTag);
    }

}
