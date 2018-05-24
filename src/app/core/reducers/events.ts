import { EVENTS_FETCH, EVENTS_FETCH_FAIL, EVENTS_FETCH_OK } from '../constants';
import { Action } from '../util';

export type EventsState = {
    data: any[];
    error: any;
    isLoading: boolean;
};

const initialState: EventsState = {
    data: [],
    error: undefined,
    isLoading: false,
};

export function eventsReducer(state = initialState, action: Action<any>): EventsState {
    if (action.type === EVENTS_FETCH_OK) {
        return {
            ...state,
            error: undefined,
            data: action.payload,
            isLoading: false,
        };
    }
    if (action.type === EVENTS_FETCH) {
        return {
            ...state,
            isLoading: true,
        };
    }
    if (action.type === EVENTS_FETCH_FAIL) {
        return {
            ...state,
            isLoading: false,
            error: action.payload,
        };
    }
    return state;
}
