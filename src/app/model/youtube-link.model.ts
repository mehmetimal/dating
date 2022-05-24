export interface IYoutubeLink {
    _id?: string;
    youtubeLink?: string;
    isActive?: boolean;
}

export class YoutubeLink implements IYoutubeLink {
    constructor(
        public  _id?: string,
        public youtubeLink?: string,
        public isActive?: boolean
    ) {
    }
}
