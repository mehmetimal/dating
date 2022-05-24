import {IUser} from './user.model';

export interface IProfileVisitors {
    _id?: string;
    userId?: IUser;
    isLike?: boolean;
    isProfile?: boolean;
    isPlay?: boolean;
    visitedUser?: IUser;
}

export class ProfileVisitors implements IProfileVisitors {
    constructor(
        public _id?: string,
        public userId?: IUser,
        public isLike?: boolean,
        public isProfile?: boolean,
        public isPlay?: boolean,
        public visitedUser?: IUser
    ) {
    }
}
