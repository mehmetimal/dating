import {IUdcName} from './udc-name.model';
import {IImage} from './image.model';

export interface IUdc {
    _id?: string;
    name?: IUdcName;
    image?: IImage;
    active?: boolean;
    createdDate?: Date;
}

export class Udc implements IUdc {
    constructor(
        public  _id?: string,
        public name?: IUdcName,
        public image?: IImage,
        public active?: boolean,
        public createdDate?: Date
    ) {
    }
}
