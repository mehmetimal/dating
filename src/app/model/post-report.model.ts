import {IUser} from './user.model';
import {IPost} from './post.model';

export interface IPostReport {
    _id?: string;
    reportUser?: IUser;
    post?: IPost;
    createdAt?: Date;
    activated?: boolean;
}

export class PostReport implements IPostReport {
    constructor(
        public reportUser?: IUser,
        public post?: IPost,
        public createdAt?: Date,
        public activated?: boolean
    ) {
    }
}
