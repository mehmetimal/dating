export interface IFooter {
    _id?: number;
    facebook?: string;
    twitter?: string;
    instagram?: string;
}

export class Footer implements IFooter {
    constructor(
        public  _id?: number,
        public facebook?: string,
        public twitter?: string,
        public instagram?: string
    ) {
    }
}
