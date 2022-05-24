export interface IMarketing {
    _id?: number;
    text?: string;
    content?: string;
}

export class Marketing implements IMarketing {
    constructor(
        public  _id?: number,
        public text?: string,
        public content?: string
    ) {
    }
}
