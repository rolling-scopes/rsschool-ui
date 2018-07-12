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
        case SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES:
        case SCHEDULE.ADD_COURSE_STAGE:
        case SCHEDULE.UPDATE_COURSE_STAGE: {
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
        case SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_FAIL:
        case SCHEDULE.ADD_COURSE_STAGE_FAIL:
        case SCHEDULE.UPDATE_COURSE_STAGE_FAIL: {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
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

        default:
            return state;
    }
}
