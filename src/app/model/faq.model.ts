export interface IFaq {
    _id?: number;
    text?: string;
    content?: string;
}

export class Faq implements IFaq {
    constructor(
        public  _id?: number,
        public text?: string,
        public content?: string
    ) {
    }
}
