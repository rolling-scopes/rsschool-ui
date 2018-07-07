import { AnyAction } from 'redux';

import { EVENTS } from './constants';
import { IEvent, IStage } from './models';

interface IFetchCourseEventsAction {
    type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES;
}

interface IFetchCourseEventsOkAction {
    type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_OK;
    payload: {
        events: IEvent[];
        stages: IStage[];
    };
}

interface IFetchCourseEventsFailAction {
    type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_FAIL;
    payload: Error;
}

export type IEventsAction = IFetchCourseEventsAction | IFetchCourseEventsOkAction | IFetchCourseEventsFailAction;

export interface Action<T> extends AnyAction {
    type: string;
    payload?: T;
}
