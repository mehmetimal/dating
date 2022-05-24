import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from "../../../../services/user.service";
import {IRole} from "../../../../model/role.model";

@Component({
    selector: 'app-profile-menu-links',
    templateUrl: './profile-menu-links.component.html',
    styleUrls: ['./profile-menu-links.component.scss']
})
export class ProfileMenuLinksComponent implements OnInit, OnChanges {
    public profileStatisticsModal: NgbModalRef;
    public profileClubStatisticsModal: NgbModalRef;
    public bsModalRef: NgbModalRef;
    public isPremium = false;
    @Input() totalLikeCount;
    @Input() user;
    @Input() messageCount;

    @ViewChild('firstDropModal', {static: true}) public content;
    @ViewChild('clubstatisticsModal', {static: true}) public clubContent;

    constructor(private modalService: NgbModal, private userService: UserService) {
    }

    ngOnInit() {

    }

    openStatisticsModal() {
        setTimeout(() => {
            this.profileStatisticsModal = this.modalService.open(this.content, {centered: true});
        }, 0);
    }

    openClubStatisticsModal() {
        setTimeout(() => {
            this.profileClubStatisticsModal = this.modalService.open(this.clubContent, {centered: true});
        }, 0);
    }

    openFavoriteModal(content) {
        this.bsModalRef = this.modalService.open(content, {centered: true});
    }

    isCurrentUserHasRole(roleName): boolean {
        let result = false;
        const roles: IRole[] = this.user.roles;
        if (roles && roles.length > 0) {
            result = roles.filter((role: IRole) => role && role.name === roleName).length > 0 ? true : false;
        }
        return result;
    }

    ngOnChanges(changes): void {
        if (changes['user']) {
            if (this.user) {
                this.isPremium = this.isCurrentUserHasRole('ROLE_PREMIUM');
            }
        }
    }

}
