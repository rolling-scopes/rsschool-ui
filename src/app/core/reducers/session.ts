import { SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';
import { Action } from '../util';

export type SessionState = {
    isAdmin: boolean;
    isLoading: boolean;
    isLoggedIn: boolean;
};

const initialState: SessionState = {
    isAdmin: false,
    isLoggedIn: false,
    isLoading: true,
};

export function sessionReducer(state = initialState, action: Action<any>): SessionState {
    if (action.type === SESSION_FETCH_OK) {
        return {
            isAdmin: action.payload.isAdmin,
            isLoading: false,
            isLoggedIn: true,
        };
    }
    if (action.type === SESSION_FETCH_FAIL) {
        return {
            isAdmin: false,
            isLoading: false,
            isLoggedIn: false,
        };
    }
    return state;
}
