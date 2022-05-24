export interface ISpielwiese {
    name?: string;
    content?: string;
}

export class Spielwiese implements ISpielwiese {
    constructor(
        public _id?: string,
        public name?: string,
        public content?: string,
    ) {
    }
}
