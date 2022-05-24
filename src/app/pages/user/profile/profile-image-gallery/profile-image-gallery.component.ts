import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../../../../model/image.model';
import {AcceptStateEnum} from '../../../../model/accept-state.enum';
import {mergeMap, switchMap} from 'rxjs/operators';
import {GalleryService} from '../../../../services/gallery.service';
import {UserService} from '../../../../services/user.service';
import {JhiEventManager} from '../../../../services/event-manager.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {VipErrorModalComponent} from '../../messages/vip-error-modal.component';
import {TokenService} from '../../../../services/token.service';
import {LocalStorageService} from 'ngx-webstorage';

@Component({
    selector: 'app-profile-image-gallery',
    templateUrl: './profile-image-gallery.component.html',
    styleUrls: ['./profile-image-gallery.component.scss']
})
export class ProfileImageGalleryComponent implements OnInit {
    @Input() imageGallery;
    @Input() backendURL;
    @Input() profileImage;
    public approved = AcceptStateEnum.APPROVED;
    public notApproved = AcceptStateEnum.NOTAPPROVED;
    public vipErrorModalCheckbox = false;

    constructor(private eventManager: JhiEventManager,
                private galleryService: GalleryService,
                public userService: UserService,
                private modalService: NgbModal,
                private tokenService: TokenService,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
        this.eventManager.subscribe('change-vip-error-modal-checkbox', (data) => {
            this.vipErrorModalCheckbox = data.content;
        });
    }

    broadCastGalleryModalDialogOpenChanged() {
        const currentUser = this.tokenService.getPayload();
        if (!this.localStorageService.retrieve(currentUser._id + 'isProfileModalShow')) {
            const content = 'willkommen in deiner Bildergalerie! Hier kannst du 5 Bilder von dir hochladen. Bitte beachte, dass die Bilder nachdem Hochladen erst vom Support geprüft und freigeschalten werden müssen. Bis dein Bild freigegeben wurde, kannst nur du es sehen. Nach der Freischaltung kannst du jedes Bild zum Profilbild ernennen und auch für andere User die Verpixelung entfernen.';
            const modalRef = this.modalService.open(VipErrorModalComponent, {
                centered: true,
                backdropClass: 'vip-error-modal-header-margin',
                windowClass: 'vip-error-modal-header-margin vip-error-modal-background-color'
            });
            modalRef.componentInstance.name = currentUser.profileName;
            modalRef.componentInstance.content = content;
            modalRef.componentInstance.isClose = true;
            modalRef.componentInstance.isUrl = true;
            modalRef.componentInstance.urlText = 'Hilfe zur Verpixelung';
            modalRef.componentInstance.url = 'Anleitungen';
            modalRef.componentInstance.isCheckbox = true;
            modalRef.componentInstance.isLightBackground = true;
            modalRef.componentInstance.isPriseButton = false;
            modalRef.componentInstance.isBackButton = false;
            modalRef.componentInstance.isProfile = true;
            modalRef.result.then(() => {
            }, (result) => {
                this.localStorageService.store(currentUser._id + 'isProfileModalShow', this.vipErrorModalCheckbox);
            });
        }
    }

    openProfileGalleryModal() {
        this.broadCastGalleryModalDialogOpenChanged();
        this.eventManager.broadcast({
            name: 'gallery-modal-dialog-open',
            content: {
                isProfile: false,
                image: null
            }
        });
    }

    openLightBox(image: IImage) {
        this.eventManager.broadcast({
            name: 'gallery-modal-dialog-open',
            content: {
                image: image,
                isProfile: false
            }
        });
    }

    public get sortedArray(): IImage[] {
        return this.imageGallery.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }

    deleteGalleryImageById(image: any) {
        this.galleryService.deleteGalleryImageById(image._id).pipe(
            mergeMap(value => this.userService.findCurrentUserProfile())
        ).subscribe((data: any) => {
            this.eventManager.broadcast({
                name: 'profileGalleryChanged',
                content: data.response
            });
        });
    }

}
