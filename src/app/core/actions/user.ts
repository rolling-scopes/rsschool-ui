import { USER } from '../constants';
import { IProfile } from '../models';

export function updateProfile(data: IProfile) {
    return {
        type: USER.PROFILE_UPDATE,
        payload: data,
    };
}

export function fetchProfile() {
    return {
        type: USER.PROFILE_FETCH,
    };
}

export function fetchUserParticipations() {
    return {
        type: USER.PARTICIPATIONS_FETCH,
    };
}

export function fetchFeed() {
    return {
        type: USER.FEED_FETCH,
    };
}
