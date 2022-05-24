import {IUser} from './user.model';

export interface ISharedAllImageCondition {
    _id?: string;
    active?: boolean;
    fromUser?: IUser;
    toUser?: IUser;
    createdAt?: Date;
}

export class SharedAllImageCondition implements ISharedAllImageCondition {
    constructor(
        public _id?: string,
        public active?: boolean,
        public fromUser?: IUser,
        public toUser?: IUser,
        public createdAt?: Date
    ) {
    }
}
