import { USER } from '../constants';
import { IProfile } from '../models';
import { getSession, getProfile, updateProfile, getUserParticipations, getFeed } from '../api';

export function fetchSession() {
    return async (dispatch: any) => {
        dispatch({
            type: USER.FETCH_SESSION,
        });
        try {
            const result = await getSession();
            dispatch({
                type: USER.FETCH_SESSION_OK,
                payload: result,
            });
        } catch (err) {
            dispatch({
                type: USER.FETCH_SESSION_FAIL,
            });
        }
    };
}

export function updateUserProfile(data: IProfile) {
    return async (dispatch: any) => {
        dispatch({
            type: USER.PROFILE_UPDATE,
        });

        try {
            const result = await updateProfile(data);
            dispatch({
                type: USER.PROFILE_UPDATE_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: USER.PROFILE_UPDATE_FAIL,
            });
        }
    };
}

export function fetchUserProfile() {
    return async (dispatch: any) => {
        dispatch({
            type: USER.PROFILE_FETCH,
        });

        try {
            const result = await getProfile();
            dispatch({
                type: USER.PROFILE_FETCH_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: USER.PROFILE_FETCH_FAIL,
            });
        }
    };
}

export function fetchUserParticipations() {
    return async (dispatch: any) => {
        dispatch({
            type: USER.PARTICIPATIONS_FETCH,
        });

        try {
            const result = await getUserParticipations();
            dispatch({
                type: USER.PARTICIPATIONS_FETCH_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: USER.PARTICIPATIONS_FETCH_FAIL,
            });
        }
    };
}

export function fetchFeed() {
    return async (dispatch: any) => {
        dispatch({
            type: USER.FEED_FETCH,
        });

        try {
            const result = await getFeed();
            dispatch({
                type: USER.FEED_FETCH_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: USER.FEED_FETCH_FAIL,
            });
        }
    };
}
