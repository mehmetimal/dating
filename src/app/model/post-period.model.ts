export interface IPostPeriod {
    _id?: string;
    period?: number;
}

export class PostPeriod implements IPostPeriod {
    constructor(
        public _id?: string,
        public period?: number
    ) {
    }
}
