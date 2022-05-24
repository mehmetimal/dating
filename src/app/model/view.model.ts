import {IUser} from './user.model';
import {IPost} from './post.model';

export interface IView {
    _id?: string;
    user?: IUser;
    post?: IPost;
    createdAt?: Date;
}

export class View implements IView {
    constructor(
        public _id?: string,
        public user?: IUser,
        public post?: IPost,
        public createdAt?: Date
    ) {
    }
}
