import {IUser} from './user.model';
import {IImage} from './image.model';

export interface ISharedImage {
    _id?: string;
    image?: IImage;
    fromUser?: IUser;
    toUser?: IUser;
}

export class SharedImage implements ISharedImage {
    constructor(
        public _id?: string,
        public image?: IImage,
        public fromUser?: IUser,
        public toUser?: IUser
    ) {
    }
}
