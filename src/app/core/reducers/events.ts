import { EVENTS } from '../constants';
import { Action } from '../util';
import { IEvent } from '../models';

export type EventsState = {
    data: IEvent[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
};

const initialState: EventsState = {
    data: [],
    error: undefined,
    isLoading: false,
};

export function eventsReducer(state = initialState, action: Action<IEvent[] | Error>): EventsState {
    switch (action.type) {
        case EVENTS.FETCH_COURSE_EVENTS: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case EVENTS.FETCH_COURSE_EVENTS_OK: {
            return {
                error: undefined,
                data: action.payload as IEvent[],
                isLoading: false,
            };
        }
        case EVENTS.FETCH_COURSE_EVENTS_FAIL: {
            return {
                data: [],
                isLoading: false,
                error: action.payload as Error,
            };
        }
        default:
            return state;
    }
}
