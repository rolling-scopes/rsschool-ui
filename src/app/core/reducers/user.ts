import { USER } from '../constants';
import { IFeedRecord, IProfile, IUserParticipation } from '../models';
import { Action } from '../util';

export type UserState = {
    profile: IProfile | undefined;
    participations: IUserParticipation[];
    feed: IFeedRecord[];
    username: string;
    isAdmin: boolean;
    isLoggedIn: boolean;
};

const initialState: UserState = {
    profile: undefined,
    participations: [],
    feed: [],
    username: '',
    isAdmin: false,
    isLoggedIn: false,
};

export function userReducer(state = initialState, action: Action<any>): UserState {
    if (action.type === USER.PROFILE_FETCH_OK) {
        return {
            ...state,
            profile: action.payload,
        };
    }
    if (action.type === USER.PROFILE_UPDATE_OK) {
        return {
            ...state,
            profile: action.payload,
        };
    }
    if (action.type === USER.PARTICIPATIONS_FETCH_OK) {
        return {
            ...state,
            participations: action.payload,
        };
    }

    if (action.type === USER.FEED_FETCH_OK) {
        return {
            ...state,
            feed: action.payload,
        };
    }
    if (action.type === USER.FETCH_SESSION_OK) {
        return {
            ...state,
            username: action.payload._id,
            isAdmin: action.payload.isAdmin,
            isLoggedIn: true,
        };
    }
    return state;
}
