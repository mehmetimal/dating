export interface IActivationLogin {
    _id?: number;
    content?: string;
}

export class ActivationLogin implements IActivationLogin {
    constructor(
        public  _id?: number,
        public content?: string
    ) {
    }
}
