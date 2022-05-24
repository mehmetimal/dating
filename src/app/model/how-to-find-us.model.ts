export interface IHowToFindUs {
    _id?: string;
    name?: string;
}

export class HowToFindUs implements IHowToFindUs {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
