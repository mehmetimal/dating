export interface IEyeColor {
    _id?: string;
    name?: string;
}

export class EyeColor implements IEyeColor {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
