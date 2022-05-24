import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';

@Component({
    selector: 'app-profile-about-card',
    templateUrl: './profile-about-card.component.html',
    styleUrls: ['./profile-about-card.component.scss']
})
export class ProfileAboutCardComponent implements OnInit {
    @Input() about: string;
    public notEditable = true;
    public aboutEdit = false;
    public readMore = false;

    constructor(public userService: UserService) {
    }

    ngOnInit() {
    }

    aboutEditable() {
        if (this.notEditable) {
            this.notEditable = false;
            if (!this.aboutEdit) {
                this.aboutEdit = true;
            } else {
                this.aboutEdit = false;
            }
        } else {
        }
        this.readMore = !this.aboutEdit;
    }

    aboutEditCancel() {
        this.aboutEdit = false;
        this.notEditable = true;
    }

    aboutEditSave(newAbout) {
        this.userService.updateAboutText(newAbout)
            .subscribe(data => {
                this.aboutEdit = false;
                if (data.response && data.response.about) {
                    this.about = data.response.about;
                } else if (data.response && !data.response.about) {
                    this.about = null;
                }
            });
        this.notEditable = true;
    }

    clickReadMore(isReadMore) {
        this.readMore = isReadMore;
    }

}
