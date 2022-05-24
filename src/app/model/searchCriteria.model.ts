export interface ISearchCriteria {
    userId?: string;
    searchFilterName?: string;
    minAgeValue?: string;
    highAgeValue?: string;
    postCode?: string;
    distance?: number;
    features?: any[];
    clubNumber?: string;
    created?: Date;
}

export class SearchCriteria implements ISearchCriteria {
    constructor(
        public userId?: string,
        public searchFilterName?: string,
        public minAgeValue?: string,
        public highAgeValue?: string,
        public postCode?: string,
        public distance?: number,
        public features?: any[],
        public clubNumber?: string,
        public createdDate?: Date
    ) {
    }
}
