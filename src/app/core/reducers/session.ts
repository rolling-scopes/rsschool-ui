import { SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';
import { Action } from '../util';

export type SessionState = {
    username: string;
    isAdmin: boolean;
    isLoading: boolean;
    isLoggedIn: boolean;
};

const initialState: SessionState = {
    username: '',
    isAdmin: false,
    isLoggedIn: false,
    isLoading: true,
};

export function sessionReducer(state = initialState, action: Action<any>): SessionState {
    if (action.type === SESSION_FETCH_OK) {
        return {
            username: action.payload._id,
            isAdmin: action.payload.isAdmin,
            isLoading: false,
            isLoggedIn: true,
        };
    }
    if (action.type === SESSION_FETCH_FAIL) {
        return {
            ...initialState,
            isLoading: false,
        };
    }
    return state;
}
