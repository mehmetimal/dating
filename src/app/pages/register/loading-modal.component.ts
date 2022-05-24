import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {JhiEventManager} from '../../services/event-manager.service';
import {AnimationOptions} from 'ngx-lottie';

@Component({
    selector: 'app-loading-modal',
    template: `
        <div class="modal-body border-0">
            <ng-lottie [options]="options"></ng-lottie>
        </div>
    `,
    styles: ['']
})
export class LoadingModalComponent implements OnInit {
    options: AnimationOptions = {
        path: '/assets/data.json',
    };
    constructor(public location: Location,
                private modalService: NgbModal,
                private eventManager: JhiEventManager,
                private router: Router) {
    }
    ngOnInit(): void {

    }
}
