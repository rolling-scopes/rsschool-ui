import { AnyAction } from 'redux';

import { SCHEDULE } from './constants';
import { IEvent, IStage } from './models';

interface IFetchCourseEventsAndStagesAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES;
}

interface IFetchCourseEventsAndStagesOkAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_OK;
    payload: {
        events: IEvent[];
        stages: IStage[];
    };
}

interface IFetchCourseEventsAndStagesFailAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_FAIL;
    payload: Error;
}

export type IScheduleAction =
    | IFetchCourseEventsAndStagesAction
    | IFetchCourseEventsAndStagesOkAction
    | IFetchCourseEventsAndStagesFailAction;

export interface Action<T> extends AnyAction {
    type: string;
    payload?: T;
}
