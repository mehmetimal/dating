import {Component, Input, OnInit} from '@angular/core';
import {IImage} from '../../../../model/image.model';
import {environment} from '../../../../../environments/environment';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from '../../../../services/event-manager.service';

@Component({
    selector: 'app-post-image-modal',
    templateUrl: './post-image-modal.component.html',
    styleUrls: ['./post-image-modal.component.scss']
})
export class PostImageModalComponent implements OnInit {

    @Input() selectedImage;

    @Input() udcImagesNameList = [];

    @Input() imageModalRef: NgbModalRef;

    public backendURL = environment.url;

    constructor(private eventManager: JhiEventManager) {
    }

    ngOnInit() {
    }

    selectPostImage(image: IImage) {
        this.selectedImage = image;
        this.eventManager.broadcast({
            name: 'post-image-modal-select-image-changed',
            content: this.selectedImage
        });
    }

    closeModal() {
        this.imageModalRef.close();
    }
}
