import {IUser} from './user.model';
import {IPost} from './post.model';

export interface ILike {
    _id?: string;
    user?: IUser;
    post?: IPost;
    createdAt?: Date;
    activated?: boolean;
}

export class Like implements ILike {
    constructor(
        public _id?: string,
        public user?: IUser,
        public post?: IPost,
        public createdAt?: Date,
        public activated?: boolean
    ) {
    }
}
