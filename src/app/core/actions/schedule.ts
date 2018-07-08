import { IStage } from 'core/models';
import { SCHEDULE } from '../constants';
import { getEventsAndStagesByCourseId, setStage } from '../api';

export function fetchEventsAndStages(courseId: string) {
    return async (dispatch: any) => {
        dispatch({
            type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES,
        });

        try {
            const result = await getEventsAndStagesByCourseId(courseId);
            dispatch({
                type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: SCHEDULE.FETCH_COURSE_EVENTS_AND_STAGES_FAIL,
                payload: e,
            });
        }
    };
}

export function addStage(stage: IStage) {
    return async (dispatch: any) => {
        dispatch({
            type: SCHEDULE.ADD_COURSE_STAGE,
        });

        try {
            const result = await setStage(stage);
            dispatch({
                type: SCHEDULE.ADD_COURSE_STAGE_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: SCHEDULE.ADD_COURSE_STAGE_FAIL,
                payload: e,
            });
        }
    };
}
