import {IUser} from './user.model';
import {UserRecentTransactionType} from './user-recent-transaction-type.enum';

export interface IUserRecentTransaction {
    _id?: string;
    user?: IUser;
    fromUser?: IUser;
    type?: UserRecentTransactionType;
    createAt?: Date;
    active?: boolean;
}

export class UserRecentTransaction implements IUserRecentTransaction {
    constructor(
        public _id?: string,
        public user?: IUser,
        public fromUser?: IUser,
        public type?: UserRecentTransactionType,
        public createAt?: Date,
        public active?: boolean,
    ) {
    }
}
