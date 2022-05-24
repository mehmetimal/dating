export interface IHairLength {
    _id?: string;
    name?: string;
}

export class HairLength implements IHairLength {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
