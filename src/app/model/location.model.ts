export interface ILocation {
    _id?: string;
    name?: string;
}

export class Location implements ILocation {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
