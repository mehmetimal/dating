import {IUser} from './user.model';

export interface IFavoriteUser {
    _id?: number;
    user?: IUser;
    ownUserOfFav?: IUser;
}

export class FavoriteUser implements IFavoriteUser {
    constructor(
        public  _id?: number,
        public user?: IUser,
        public ownUserOfFav?: IUser
    ) {
    }
}
