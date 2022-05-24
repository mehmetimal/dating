export interface IPayment {
    _id?: string;
    title?: string;
    price?: string;
    durationOfSubscribe?: number;
    column?: number;
    isHighlighted?: boolean;
    created?: Date;
}

export class Payment implements IPayment {
    constructor(
        public _id?: string,
        public title?: string,
        public price?: string,
        public durationOfSubscribe?: number,
        public column?: number,
        public isHighlighted?: boolean,
        public created?: Date,
    ) {
    }
}
