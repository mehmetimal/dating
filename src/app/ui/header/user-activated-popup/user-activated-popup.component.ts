import {Component, Input} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {EmailService} from '../../../services/email.service';
import * as converter from "xml-js";

@Component({
    selector: 'app-user-activated-popup',
    templateUrl: './user-activated-popup.component.html'
})
export class UserActivatedPopupComponent {

    @Input() userEmail: string;

    currentUserId: string;

    constructor(public userService: UserService,
                private emailService: EmailService) {
    }

    sendEmail() {

        this.userService.findUserByEmail(this.userEmail).subscribe((res: any) => {
            this.currentUserId = res.response._id;
            const to = this.userEmail;
            this.emailService.sendEmail(to).subscribe(
                (response) => {
                    document.getElementById('closeModalButton').click();
                },
                (err: any) => {
                }
            );
        });
    }


}
