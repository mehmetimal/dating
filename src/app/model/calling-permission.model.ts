import {IUser} from './user.model';
import {CallingPermissionStatus} from './calling-permission-status.enum';

export interface ICallingPermission {
    _id?: number;
    user?: any;
    friend?: any;
    status?: CallingPermissionStatus;
}

export class CallingPermission implements ICallingPermission {
    constructor(
        public  _id?: number,
        public user?: any,
        public friend?: any,
        public status?: CallingPermissionStatus
    ) {
    }
}
