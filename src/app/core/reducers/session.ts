import { SESSION_FETCH, SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';

const initialState = {
    isLoggedIn: false,
};

export function sessionReducer(state = initialState, action: any) {
    if (action.type === SESSION_FETCH_OK) {
        return {
            ...state,
            isLoggedIn: true,
        };
    }
    if (action.type === SESSION_FETCH_FAIL) {
        return {
            ...state,
            isLoggedIn: false,
        };
    }
    return state;
}
