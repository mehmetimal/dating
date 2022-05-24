export interface IPostFilter {
    postCode?: string;
    distance?: number;
    category?: any;
    sortCriteria?: boolean;
    isSearchNear?: boolean;
}

export class PostFilter implements IPostFilter {
    constructor(
        public postCode?: string,
        public distance?: number,
        public category?: any,
        public sortCriteria?: boolean,
        public isSearchNear?: boolean,

    ) {
        this.sortCriteria = false;
        this.category = null;
        this.isSearchNear = true;
        this.distance = 100;
    }
}
