export interface INews {
    _id?: string;
    title?: string;
    content?: string;
    created?: Date;
    isPublish?: boolean;
    isIntern?: boolean;
    isArchive?: boolean;
    author?: string;
    imageLink?: string;
    imageThumbLink?: string;
    likes?: any[];
    categories?: string[];
}

export class News implements INews {
    constructor(
        public title?: string,
        public content?: string,
        public isPublish?: boolean,
        public isIntern?: boolean,
        public isArchive?: boolean,
        public author?: string,
        public imageLink?: string,
        public imageThumbLink?: string,
        public likes?: any[],
        public categories?: string[],
    ) {
    }
}
