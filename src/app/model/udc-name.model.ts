export interface IUdcName {
    _id?: string;
    name?: string;
    active?: boolean;
    createdDate?: Date;
}

export class UdcName implements IUdcName {
    constructor(
        public  _id?: string,
        public name?: string,
        public active?: boolean,
        public createdDate?: Date
    ) {
    }
}
