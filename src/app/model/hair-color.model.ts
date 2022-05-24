export interface IHairColor {
    _id?: string;
    name?: string;
}

export class HairColor implements IHairColor {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
