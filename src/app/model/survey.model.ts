export interface ISurvey {
    _id?: number;
    text?: string;
    content?: string;
}

export class Survey implements ISurvey {
    constructor(
        public  _id?: number,
        public text?: string,
        public content?: string
    ) {
    }
}
