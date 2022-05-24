import {Component, HostListener, Input, OnInit} from '@angular/core';
import {FooterLinkService} from "../../../services/footer-link.service";
import {NgbModalRef, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {JhiEventManager} from "../../../services/event-manager.service";
import {LoadingModalComponent} from "../../../pages/register/loading-modal.component";

@Component({
    selector: 'app-check-agb-modal',
    templateUrl: './check-agb-modal.component.html'
})
export class CheckAgbModalComponent implements OnInit {
    @Input() bsModalRef: NgbModalRef;
    @Input() email: string;
    public data: any;
    rejectAgb = false;

    constructor(private footerLinkService: FooterLinkService,
                private modalService: NgbModal,
                private eventManager: JhiEventManager) {
    }

    ngOnInit(): void {
        this.getAGBContent();
    }

    getAGBContent() {
        this.footerLinkService.footerLinkGetIdTitle('AGB').subscribe(data => {
            if (data['data'] === null) {
               this.data = null;
            } else {
                this.data = data['data']['content'];
            }

        });
    }

    approve() {
        this.loadingModal();
        this.footerLinkService.updateCurrentUserAgbVersion(this.email).subscribe(value => {
            this.eventManager.broadcast({
                name: 'click-agb-submit-button'
            });
            this.close();
        }, error => {
            this.eventManager.broadcast({
                name: 'click-agb-submit-button'
            });
            this.close();
        });
    }

    loadingModal() {
        const modalRef = this.modalService.open(LoadingModalComponent, {
            centered: true,
            backdropClass: 'loading-modal-backdrop',
            windowClass: 'loading-modal-backdrop',
            backdrop: 'static'
        });
    }

    close() {
        this.bsModalRef.close();
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
        }
    }

    reject() {
        if (this.rejectAgb) {
            this.close();
        }
        this.rejectAgb = true;
    }
}
