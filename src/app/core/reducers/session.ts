import { SESSION_FETCH, SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';
import { Action } from '../util';

export type SessionState = {
    isLoggedIn: boolean;
};

const initialState: SessionState = {
    isLoggedIn: false,
};

export function sessionReducer(state = initialState, action: Action<any>): SessionState {
    if (action.type === SESSION_FETCH_OK) {
        return {
            isLoggedIn: true,
        };
    }
    if (action.type === SESSION_FETCH_FAIL) {
        return {
            isLoggedIn: false,
        };
    }
    return state;
}
