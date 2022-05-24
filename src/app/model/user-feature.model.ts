export interface IUserFeature {
    _id?: string;
    name?: string;
}

export class UserFeature implements IUserFeature {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
