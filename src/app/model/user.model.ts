import {IGender} from './gender.model';
import {IEyeColor} from './eye-color.model';
import {IHeight} from './height.model';
import {IHairColor} from './hair-color.model';
import {IBodyTypes} from './body-types.model';
import {IHairLength} from './hair-length.model';
import {IRelationShipStatus} from './relationship-status.model';
import {ILocation} from './location.model';
import {IHowToFindUs} from './how-to-find-us.model';
import {IImage} from './image.model';
import {IUserFeature} from './user-feature.model';
import {IPost} from './post.model';
import {HobbyAnswerType} from './hobby-answer-type.enum';
import {IFavoriteUser} from './favorite-user.model';

export interface IUser {
    _id?: string;
    email?: string;
    password?: string;
    gender?: IGender;
    searchGender?: IGender;
    birthday?: Date | any;
    imageBlur?: boolean;
    loginTime?: string;
    profileName?: string;
    oldProfileName?: string;
    profileBackgroundImage?: string;
    eyeColour?: IEyeColor;
    height?: IHeight;
    hairColour?: IHairColor;
    bodyBuild?: IBodyTypes;
    hairLength?: IHairLength;
    relationshipStatus?: IRelationShipStatus;
    searchArea?: ILocation;
    howToFindUs?: IHowToFindUs;
    createdDate?: Date;
    about?: string;
    status?: string;
    rememberme?: boolean;
    profileImagesSharedFromMe?: IUser[];
    profileImagesSharedToMe?: IUser[];
    isAccountDisabled?: boolean;
    isEmailNotifyRequired?: boolean;
    isWantPartnerOffer?: boolean;
    isWeeklyAccountStatics?: boolean;
    isEmailNotifyForReceipt?: boolean;
    isAcceptAutoStartVideo?: boolean;
    isGalleryProfileImage?: boolean;
    isHolidaysMode?: boolean;
    isAutoStatics?: boolean;
    isPaidMembership?: boolean;
    isShowWhoIsOnline?: boolean;
    blockUserList?: IUser[];
    profileImage?: IImage;
    lat?: number;
    lng?: number;
    chats?: [];
    clubNumber?: string;
    features?: IUserFeature[];
    gallery?: any;
    posts?: IPost;
    piercing?: HobbyAnswerType;
    tatto?: HobbyAnswerType;
    raucher?: HobbyAnswerType;
    alkohol?: HobbyAnswerType;
    userLockedTime?: number;
    userLockedTimeDate?: Date;
    isUserLockedTimeless?: boolean;
    postCode?: string;
    ipAddress?: string;
    favoriteUser?: IFavoriteUser[];
    randomNumber?: number;
    isSecretLogin?: boolean;
    unsubscribeDetail?: {
        date?: Date,
        isUnsubscribe?: boolean
    };
    premiumForOneWeek?: {
        isPremiumForOneWeek?: boolean,
        startedDate?: Date,
        isPremiumForOneWeekFinished?: boolean
    };
    isMessageEmail?: boolean;
    registerId?: number;
}

export class User implements IUser {
    constructor(
        public _id?: string,
        public email?: string,
        public password?: string,
        public gender?: IGender,
        public searchGender?: IGender,
        public birthday?: Date | any,
        public imageBlur?: boolean,
        public loginTime?: string,
        public profileName?: string,
        public oldProfileName?: string,
        public profileBackgroundImage?: string,
        public eyeColour?: IEyeColor,
        public height?: IHeight,
        public hairColour?: IHairColor,
        public bodyBuild?: IBodyTypes,
        public hairLength?: IHairLength,
        public relationshipStatus?: IRelationShipStatus,
        public searchArea?: ILocation,
        public howToFindUs?: IHowToFindUs,
        public createdDate?: Date,
        public about?: string,
        public status?: string,
        public rememberme?: boolean,
        public profileImagesSharedFromMe?: IUser[],
        public profileImagesSharedToMe?: IUser[],
        public isAccountDisabled?: boolean,
        public isEmailNotifyRequired?: boolean,
        public isWantPartnerOffer?: boolean,
        public isWeeklyAccountStatics?: boolean,
        public isHolidaysMode?: boolean,
        public isGalleryProfileImage?: boolean,
        public isEmailNotifyForReceipt?: boolean,
        public isAcceptAutoStartVideo?: boolean,
        public isPaidMembership?: boolean,
        public isAutoStatics?: boolean,
        public isShowWhoIsOnline?: boolean,
        public blockUserList?: IUser[],
        public profileImage?: IImage,
        public lat?: number,
        public lng?: number,
        public chats?: [],
        public clubNumber?: string,
        public features?: IUserFeature[],
        public gallery?: any,
        public posts?: IPost,
        public piercing?: HobbyAnswerType,
        public tatto?: HobbyAnswerType,
        public raucher?: HobbyAnswerType,
        public alkohol?: HobbyAnswerType,
        public userLockedTime?: number,
        public userLockedTimeDate?: Date,
        public isUserLockedTimeless?: boolean,
        public postCode?: string,
        public ipAddress?: string,
        public favoriteUser?: IFavoriteUser[],
        public randomNumber?: number,
        public isSecretLogin?: boolean,
        public unsubscribeDetail?: {
            date: Date,
            isUnsubscribe: boolean
        },
        public premiumForOneWeek?: {
            isPremiumForOneWeek?: boolean,
            startedDate?: Date,
            isPremiumForOneWeekFinished?: boolean
        },
        public isMessageEmail?: boolean,
        public registerId?: number
    ) {
    }
}
