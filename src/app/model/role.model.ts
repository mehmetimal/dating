export interface IRole {
    _id?: string;
    name?: string;
}

export class Role implements IRole {
    constructor(public _id?: string, public name?: string) {
    }
}
