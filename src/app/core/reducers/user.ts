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
    isLoading: boolean;
};

const initialState: UserState = {
    profile: undefined,
    participations: [],
    feed: [],
    username: '',
    isAdmin: false,
    isLoggedIn: false,
    isLoading: false,
};

export function userReducer(state = initialState, action: Action<any>): UserState {
    switch (action.type) {
        case USER.PROFILE_FETCH_OK: {
            return {
                ...state,
                profile: action.payload,
            };
        }
        case USER.PROFILE_UPDATE_OK: {
            return {
                ...state,
                profile: action.payload,
            };
        }

        case USER.PARTICIPATIONS_FETCH: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case USER.PARTICIPATIONS_FETCH_OK: {
            return {
                ...state,
                participations: action.payload,
                isLoading: false,
            };
        }
        case USER.PARTICIPATIONS_FETCH_FAIL: {
            return {
                ...state,
                isLoading: false,
            };
        }

        case USER.FEED_FETCH: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case USER.FEED_FETCH_OK: {
            return {
                ...state,
                feed: action.payload,
                isLoading: false,
            };
        }
        case USER.FEED_FETCH_FAIL: {
            return {
                ...state,
                isLoading: false,
            };
        }

        case USER.FETCH_SESSION: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case USER.FETCH_SESSION_OK: {
            return {
                ...state,
                username: action.payload._id,
                isAdmin: action.payload.isAdmin,
                isLoggedIn: true,
                isLoading: false,
            };
        }
        case USER.FETCH_SESSION_FAIL: {
            return {
                ...state,
                isLoading: false,
            };
        }
    }
    return state;
}
