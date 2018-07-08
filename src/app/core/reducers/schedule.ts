import { SCHEDULE } from '../constants';
import { IScheduleAction } from '../util';
import { IEvent, IStage } from '../models';

export type ScheduleState = {
    events: IEvent[] | undefined;
    stages: IStage[] | undefined;
    error: Error | undefined;
    isLoading: boolean;
};

const initialState: ScheduleState = {
    events: [],
    stages: [],
    error: undefined,
    isLoading: false,
};

export function scheduleReducer(state = initialState, action: IScheduleAction): ScheduleState {
    switch (action.type) {
        case SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES: {
            return {
                ...state,
                isLoading: true,
            };
        }
        case SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_OK: {
            return {
                error: undefined,
                events: action.payload.events,
                stages: action.payload.stages,
                isLoading: false,
            };
        }
        case SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_FAIL: {
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
