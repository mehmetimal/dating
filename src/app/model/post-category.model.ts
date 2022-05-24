export interface IPostCategory {
    _id?: string;
    name?: string;
    content?: string;
    createdAt?: Date;
    parent?: IPostCategory;
}

export class PostCategory implements IPostCategory {
    constructor(
        public _id?: string,
        public name?: string,
        public content?: string,
        public createdAt?: Date,
        public parent?: IPostCategory
    ) {
    }
}
