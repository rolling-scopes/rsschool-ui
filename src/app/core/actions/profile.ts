import { PROFILE_FETCH, PROFILE_UPDATE } from '../constants';
import { IProfile } from '../models';

export function updateProfile(data: IProfile) {
    return {
        type: PROFILE_UPDATE,
        payload: data,
    };
}

export function fetchProfile() {
    return {
        type: PROFILE_FETCH,
    };
}
