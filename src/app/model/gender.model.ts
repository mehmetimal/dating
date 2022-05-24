export interface IGender {
    _id?: string;
    name?: string;
}

export class Gender implements IGender {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
