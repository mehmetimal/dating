export interface IEmail {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
}

export class Email implements IEmail {
    constructor(
        public from?: string,
        public to?: string,
        public subject?: string,
        public text?: string
    ) {
    }
}
