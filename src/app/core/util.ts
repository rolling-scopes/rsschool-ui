import { AnyAction } from 'redux';

import { SCHEDULE } from './constants';
import { IEventDocument, IStageDocument } from './models';

interface IFetchCourseEventsAndStagesAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES;
}

interface IFetchCourseEventsAndStagesOkAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_OK;
    payload: {
        events: IEventDocument[];
        stages: IStageDocument[];
    };
}

interface IFetchCourseEventsAndStagesFailAction {
    type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_FAIL;
    payload: Error;
}

interface IAddCourseStageAction {
    type: SCHEDULE.ADD_COURSE_STAGE;
}

interface IAddCourseStageOkAction {
    type: SCHEDULE.ADD_COURSE_STAGE_OK;
    payload: IStageDocument;
}

interface IAddCourseStageFailAction {
    type: SCHEDULE.ADD_COURSE_STAGE_FAIL;
    payload: Error;
}

interface IUpdateCourseStageAction {
    type: SCHEDULE.UPDATE_COURSE_STAGE;
}

interface IUpdateCourseStageOkAction {
    type: SCHEDULE.UPDATE_COURSE_STAGE_OK;
    payload: IStageDocument;
}

interface IUpdateCourseStageFailAction {
    type: SCHEDULE.UPDATE_COURSE_STAGE_FAIL;
    payload: Error;
}

export type IScheduleAction =
    | IFetchCourseEventsAndStagesAction
    | IFetchCourseEventsAndStagesOkAction
    | IFetchCourseEventsAndStagesFailAction
    | IAddCourseStageAction
    | IAddCourseStageOkAction
    | IAddCourseStageFailAction
    | IUpdateCourseStageAction
    | IUpdateCourseStageOkAction
    | IUpdateCourseStageFailAction;

export interface Action<T> extends AnyAction {
    type: string;
    payload?: T;
}
