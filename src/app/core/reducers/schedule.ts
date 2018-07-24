import { SCHEDULE } from '../constants';
import { IScheduleAction } from '../util';
import { IEventDocument, IStageDocument } from '../models';
import { NormalizeScheduleData, getNormalizeScheduleData } from '../helpers';

export type ScheduleState = {
    events: IEventDocument[];
    stages: IStageDocument[];
    error: Error | undefined;
    isLoading: boolean;
    normalizeData: NormalizeScheduleData[];
};

const initialState: ScheduleState = {
    events: [],
    stages: [],
    error: undefined,
    isLoading: false,
    normalizeData: [],
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
            const { events, stages } = action.payload;
            return {
                error: undefined,
                events,
                stages,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(events, stages),
            };
        }
        case SCHEDULE.ADD_COURSE_STAGE_OK: {
            const stages = [...state.stages, action.payload];
            return {
                ...state,
                stages,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(state.events, stages),
            };
        }
        case SCHEDULE.UPDATE_COURSE_STAGE_OK: {
            const stageId = action.payload._id;
            const stages = state.stages.map(stage => (stageId === stage._id ? action.payload : stage));
            return {
                ...state,
                stages,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(state.events, stages),
            };
        }
        case SCHEDULE.DELETE_COURSE_STAGE_OK: {
            const stageId = action.payload;
            const stages = state.stages.filter(stage => stageId !== stage._id);
            return {
                ...state,
                stages,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(state.events, stages),
            };
        }
        case SCHEDULE.ADD_COURSE_EVENT_OK: {
            const events = [...state.events, action.payload];
            return {
                ...state,
                events,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(events, state.stages),
            };
        }
        case SCHEDULE.UPDATE_COURSE_EVENT_OK: {
            const eventId = action.payload._id;
            const events = state.events.map(event => (eventId === event._id ? action.payload : event));
            return {
                ...state,
                events,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(events, state.stages),
            };
        }
        case SCHEDULE.DELETE_COURSE_EVENT_OK: {
            const eventId = action.payload;
            const events = state.events.filter(event => eventId !== event._id);
            return {
                ...state,
                events,
                isLoading: false,
                normalizeData: getNormalizeScheduleData(events, state.stages),
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
