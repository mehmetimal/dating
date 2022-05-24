export interface IHeight {
    _id?: string;
    name?: string;
}

export class Height implements IHeight {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
