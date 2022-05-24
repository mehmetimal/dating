export interface IBodyTypes {
    _id?: string;
    name?: string;
}

export class BodyTypes implements IBodyTypes {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
