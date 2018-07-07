import { EVENTS } from '../constants';
import { IEventsAction } from '../util';
import { IEvent, IStage } from '../models';

export type EventsState = {
    events: IEvent[] | undefined;
    stages: IStage[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
};

const initialState: EventsState = {
    events: [],
    stages: [],
    error: undefined,
    isLoading: false,
};

export function eventsReducer(state = initialState, action: IEventsAction): EventsState {
    switch (action.type) {
        case EVENTS.FETCH_COURSE_EVENTS_AND_STAGES: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_OK: {
            return {
                error: undefined,
                events: action.payload.events,
                stages: action.payload.stages,
                isLoading: false,
            };
        }
        case EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_FAIL: {
            return {
                events: [],
                stages: [],
                isLoading: false,
                error: action.payload,
            };
        }
        default:
            return state;
    }
}
