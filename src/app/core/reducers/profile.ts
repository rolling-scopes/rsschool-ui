import { PROFILE_FETCH_OK, PROFILE_UPDATE_OK } from '../constants';
import { IProfile } from '../models';
import { Action } from '../util';

export type ProfileState = {
    data: IProfile | undefined;
};

const initialState: ProfileState = {
    data: undefined,
};

export function profileReducer(state = initialState, action: Action<any>): ProfileState {
    if (action.type === PROFILE_FETCH_OK) {
        return {
            data: action.payload,
        };
    }
    if (action.type === PROFILE_UPDATE_OK) {
        return {
            data: action.payload,
        };
    }
    return state;
}
