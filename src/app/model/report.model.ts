import {ReportType} from './report-type.enum';

export interface IReport {
    _id?: string;
    reportingUser?: string;
    reportedUser?: string;
    type?: ReportType;
    content?: string;
    createdAt?: Date;
    active?: boolean;
}

export class Report implements IReport {
    constructor(
        public _id?: string,
        public reportingUser?: string,
        public reportedUser?: string,
        public type?: ReportType,
        public content?: string,
        public createdAt?: Date,
        public active?: boolean
    ) {
    }
}
