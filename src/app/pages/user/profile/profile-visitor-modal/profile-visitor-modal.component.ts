import {Component, Input} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {IFavoriteUser} from '../../../../model/favorite-user.model';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-profile-visitor-modal',
    templateUrl: './profile-visitor-modal.component.html'
})
export class ProfileVisitorModalComponent {
    @Input() isFavoriteModal;
    @Input() isLastVisitorModal;
    @Input() bsModalRef: NgbModalRef;
    public backendURL = environment.url;
    public favoriteUser: IFavoriteUser[];

    constructor() {
    }

    closeModal() {
        this.bsModalRef.close();
    }

    clickFavoriteModal() {
        this.isFavoriteModal = true;
        this.isLastVisitorModal = false;
    }

    clickLastVisitorModal() {
        this.isFavoriteModal = false;
        this.isLastVisitorModal = true;
    }
}
