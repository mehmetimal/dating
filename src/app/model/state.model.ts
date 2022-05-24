export interface IState {
    _id?: string;
    name?: string;
}

export class State implements IState {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
