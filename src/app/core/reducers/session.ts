import { SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';
import { Action } from '../util';

export type SessionState = {
    isLoggedIn: boolean;
    isLoading: boolean;
};

const initialState: SessionState = {
    isLoggedIn: false,
    isLoading: true,
};

export function sessionReducer(state = initialState, action: Action<any>): SessionState {
    if (action.type === SESSION_FETCH_OK) {
        return {
            isLoading: false,
            isLoggedIn: true,
        };
    }
    if (action.type === SESSION_FETCH_FAIL) {
        return {
            isLoading: false,
            isLoggedIn: false,
        };
    }
    return state;
}
