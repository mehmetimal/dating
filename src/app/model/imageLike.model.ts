import {IUser} from './user.model';
import {IImage} from './image.model';

export interface IImageLike {
    _id?: string;
    user?: IUser;
    image?: IImage;
}

export class ImageLike implements IImageLike {
    constructor(
        public _id?: string,
        public user?: IUser,
        public image?: IImage
    ) {
    }
}
