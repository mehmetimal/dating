export interface IRelationShipStatus {
    _id?: string;
    name?: string;
}

export class RelationShipStatus implements IRelationShipStatus {
    constructor(
        public _id?: string,
        public name?: string
    ) {
    }
}
