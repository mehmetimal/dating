import {Injectable} from '@angular/core';
import {IUser} from '../model/user.model';
import * as moment from 'moment';
import {TokenService} from './token.service';
import {JhiEventManager} from './event-manager.service';

@Injectable({
    providedIn: 'root'
})
export class MessageUtilService {
    constructor(private tokenService: TokenService,
                private eventManager: JhiEventManager) {
    }
    public selectedFriend: any;

    ageCalculation(birthday) {
        if (birthday) {
            return moment().diff(birthday, 'years');
        } else {
            return null;
        }
    }

    isExistUnReadMessage(friend: IUser, unReadMessage, loggedUser) {
        if (unReadMessage && unReadMessage.length > 0) {
            const result = unReadMessage.filter((mes: any) => (mes.senderId === friend._id && mes.senderId !== loggedUser._id)
                && (mes.isRead === false || mes.isRead === 'false')).length > 0 ? true : false;
            return result;
        } else {
            return false;
        }
    }

    unReadMessageLength(friend: IUser, unReadMessage, loggedUser) {
        if (unReadMessage && unReadMessage.length > 0) {
            const result = unReadMessage.filter((mes: any) => (mes.senderId === friend._id && mes.senderId !== loggedUser._id)
                && (mes.isRead === false || mes.isRead === 'false')).length;
            return result;
        } else {
            return '1';
        }
    }

    isCurrentUserBlockList(user: IUser) {
        if (user) {
            const currentUser = this.tokenService.getPayload();
            let blockListUser;
            if (user.blockUserList && user.blockUserList.length > 0) {
                blockListUser = user.blockUserList.find(value => value._id === currentUser._id);
            }
            return blockListUser ? true : false;
        }
    }

    selectReciever(friend: IUser) {
        this.selectedFriend = friend;
        this.eventManager.broadcast({
            name: 'selected-receiver-changed',
            content: friend
        });
    }

    getSelectedFriend() {
        return this.selectedFriend;
    }
}
