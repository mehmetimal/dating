export interface IRegisterPageImage {
    _id?: string;
    imageURL?: string;
    imageName?: string;
}

export class RegisterPageImage implements IRegisterPageImage {
    constructor(
        public _id?: string,
        public imageURL?: string,
        public imageName?: string,
    ) {
    }
}
