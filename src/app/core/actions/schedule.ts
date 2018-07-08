import { SCHEDULE } from '../constants';
import { getEventsAndStagesByCourseId } from '../api';

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
