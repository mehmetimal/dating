export interface ILandingPage {
    _id?: number;
    content?: string;
}

export class LandingPage implements ILandingPage {
    constructor(
        public  _id?: number,
        public content?: string
    ) {
    }
}
