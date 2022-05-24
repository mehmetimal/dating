import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Location} from '@angular/common';
import {JhiEventManager} from '../../../services/event-manager.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-vip-error-modal',
    template: `
        <div class="modal-header"
             [ngClass]="{'card-bg-light': isLightBackground, 'card-bg-dark': !isLightBackground}"
             style="padding-right: 70px; padding-left: 70px;">
            <img src="../../../../assets/img/Logo.png" width="24"/>
            <h4 class="modal-title fs-24 text-white">Hallo {{ name }},</h4>
            <img src="../../../../assets/img/Logo.png" width="24"/>
            <div *ngIf="isClose" class="mt-2 cursor-pointer" style="margin-right: -55px !important;">
                <i (click)="closeModal()" class="fas fa-times text-white"></i>
            </div>
        </div>
        <div class="modal-body"
             [ngClass]="{'card-bg-light': isLightBackground, 'card-bg-dark': !isLightBackground}"
             style="padding-right: 70px; padding-left: 70px;">
            <p class="text-white fs-13">
                {{ content }}
            </p>
            <div class="d-flex" *ngIf="isBackButton || isPriseButton">
                <p *ngIf="isBackButton" class="zurck-button cursor-pointer" (click)="backPage()" style="margin-right: 40px; margin-top: 5px;">zurück</p>
                <div *ngIf="isPriseButton" class="text-center">
                    <button class="btn vip-button text-white" routerLink="/preise">
                        <img width="13" src="../../../../../assets/img/Logo.png"/> jetzt VIP werden
                    </button>
                </div>
                <p><br></p>
            </div>
            <div class="d-flex">
                <div style="margin-right: 20px;" *ngIf="isUrl">
                    <p class="zurck-button cursor-pointer" (click)="goDetailPage()">{{ urlText }}</p>
                </div>
                <div class="text-white cursor-pointer" *ngIf="isCheckbox">
                    <input type="checkbox" id="checkbox" [(ngModel)]="modalCheck" (ngModelChange)="changeCheckbox()"/> <label
                        style="font-size: 12px; margin-left: 5px;" for="checkbox">Hinweis nicht mehr anzeigen</label>
                </div>
            </div>
        </div>
    `,
    styles: ['.card-bg-light {background-color: #cccccc !important;} .zurck-button {color: white; border-bottom: 1px solid transparent;} .zurck-button:hover {border-bottom: 1px solid #fff;} .vip-button { border: 1.5px solid #ff3366; border-radius: 3px; padding: 5px 30px;}.fs-24 {font-size: 24px;} .fs-13 {font-size: 13px;}']
})
export class VipErrorModalComponent implements OnInit {
    @Input() name;
    @Input() content;
    @Input() isClose = false;

    @Input() urlText = '';
    @Input() isUrl = false;
    @Input() url = '#';

    @Input() isCheckbox = false;

    @Input() isBackButton = true;
    @Input() isPriseButton = true;

    @Input() isLightBackground = false;

    @Input() isProfile = false;
    @Input() isProfileBackground = false;

    public modalCheck: any;

    constructor(public location: Location,
                private modalService: NgbModal,
                private eventManager: JhiEventManager,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    goDetailPage() {
        this.eventManager.broadcast({
            name: 'vip-modal-change-page',
            content: {
                profile: this.isProfile,
                isProfileBackground: this.isProfileBackground
            }
        });
        this.modalService.dismissAll();
        this.router.navigateByUrl(this.url);
    }

    changeCheckbox() {
        this.eventManager.broadcast({
            name: 'change-vip-error-modal-checkbox',
            content: this.modalCheck
        });
    }

    closeModal() {
        this.modalService.dismissAll();
    }

    backPage() {
        this.location.back();
    }
}
