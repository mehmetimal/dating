import {Component, Input, OnInit} from '@angular/core';
import {JhiEventManager} from '../../../../services/event-manager.service';

@Component({
    selector: 'app-message-tab-buttons',
    templateUrl: './message-tab-buttons.component.html',
    styleUrls: ['./message-tab-buttons.component.scss']
})
export class MessageTabButtonsComponent implements OnInit {

    @Input() allUnreadMessages;
    @Input() loggedUser;

    public isBlack = true;
    public isBlue: boolean;
    public isPink: boolean;

    constructor(private eventManager: JhiEventManager) {
    }

    ngOnInit() {
    }

    countOfBlackUnReadMessage() {
        if (this.allUnreadMessages && this.allUnreadMessages.length > 0) {
            const result = this.allUnreadMessages.filter((mes: any) => (mes.isRead === false || mes.isRead === 'false')
                && (mes.receiverId === this.loggedUser._id && mes.senderId !== this.loggedUser._id)).length;
            return result;
        } else {
            return 0;
        }
    }

    countOfBlueUnReadMessage() {
        return this.countOfBlackUnReadMessage();
    }

    messageUserCollapse(data) {
        this.broadCastMessageTabChanged(data);
    }

    broadCastMessageTabChanged(data) {
        data === 'black' ? this.isBlack = true : this.isBlack = false;
        data === 'pink' ? this.isPink = true : this.isPink = false;
        data === 'blue' ? this.isBlue = true : this.isBlue = false;
        this.eventManager.broadcast({
            name: 'message-tab-button--selection-changed',
            content: data
        });
    }

}
