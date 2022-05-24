export interface IRegisterPin {
    _id?: string;
    password?: string;
    active?: boolean;
}

export class RegisterPin implements IRegisterPin {
    constructor(
        public  _id?: string,
        public password?: string,
        public active?: boolean
    ) {
    }
}
