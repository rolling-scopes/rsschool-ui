import { SCHEDULE } from '../constants';
import { IScheduleAction } from '../util';
import { IEventDocument, IStageDocument } from '../models';

export type ScheduleState = {
    events: IEventDocument[];
    stages: IStageDocument[];
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
        case SCHEDULE.LOADING: {
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
        case SCHEDULE.ADD_COURSE_STAGE_OK: {
            return {
                ...state,
                stages: [...state.stages, action.payload],
                isLoading: false,
            };
        }
        case SCHEDULE.UPDATE_COURSE_STAGE_OK: {
            const stageId = action.payload._id;
            return {
                ...state,
                stages: state.stages.map(stage => (stageId === stage._id ? action.payload : stage)),
                isLoading: false,
            };
        }
        case SCHEDULE.DELETE_COURSE_STAGE_OK: {
            const stageId = action.payload;
            return {
                ...state,
                stages: state.stages.filter(stage => stageId !== stage._id),
                isLoading: false,
            };
        }
        case SCHEDULE.ADD_COURSE_EVENT_OK: {
            return {
                ...state,
                events: [...state.events, action.payload],
                isLoading: false,
            };
        }
        case SCHEDULE.UPDATE_COURSE_EVENT_OK: {
            const eventId = action.payload._id;
            return {
                ...state,
                events: state.events.map(event => (eventId === event._id ? action.payload : event)),
                isLoading: false,
            };
        }
        case SCHEDULE.DELETE_COURSE_EVENT_OK: {
            const eventId = action.payload;
            return {
                ...state,
                events: state.events.filter(event => eventId !== event._id),
                isLoading: false,
            };
        }
        case SCHEDULE.FAIL: {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        }

        default:
            return state;
    }
}
