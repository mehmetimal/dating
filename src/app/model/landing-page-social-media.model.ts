export interface ILandingPageSocialMedia {
    _id?: number;
    content?: string;
}

export class LandingPageSocialMedia implements ILandingPageSocialMedia {
    constructor(
        public  _id?: number,
        public content?: string
    ) {
    }
}
