import {ImageLike} from './imageLike.model';
import {AcceptStateEnum} from './accept-state.enum';

export interface IImage {
    _id?: string;
    imageURL?: string;
    imageBlurURL?: string;
    imageType?: string;
    likes?: ImageLike[];
    totalLikes?: number;
    createdDate?: Date;
    isBlurRemoved?: boolean;
    acceptState?: AcceptStateEnum;
    isProfile?: boolean;

}

export class Image implements IImage {
    constructor(
        public _id?: string,
        public imageURL?: string,
        public imageBlurURL?: string,
        public imageType?: string,
        public likes?: ImageLike[],
        public totalLikes?: number,
        public createdDate?: Date,
        public isBlurRemoved?: boolean,
        public acceptState?: AcceptStateEnum,
        public isProfile?: boolean
    ) {
    }
}
