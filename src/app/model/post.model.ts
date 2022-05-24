import {IImage} from './image.model';
import {IUser} from './user.model';
import {IPostCategory} from './post-category.model';
import {IPostPeriod} from './post-period.model';

export interface IPost {
    _id?: string;
    post?: string;
    title?: string;
    image?: IImage;
    createdAt?: Date;
    user?: IUser;
    isEdit?: boolean;
    visibleNumberOfDays?: number;
    postCode?: string;
    postMainCategory?: IPostCategory;
    postSubCategory?: IPostCategory;
    postPeriod?: IPostPeriod;
    isActive?: boolean;
}

export class Post implements IPost {
    constructor(
        public _id?: string,
        public post?: string,
        public title?: string,
        public image?: IImage,
        public createdAt?: Date,
        public user?: IUser,
        public isEdit?: boolean,
        public visibleNumberOfDays?: number,
        public postCode?: string,
        public postMainCategory?: IPostCategory,
        public postSubCategory?: IPostCategory,
        public postPeriod?: IPostPeriod,
        public isActive?: boolean
    ) {
    }
}
