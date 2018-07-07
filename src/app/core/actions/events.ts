import { EVENTS } from '../constants';
import { getEventsAndStagesByCourseId } from '../api';

export function fetchEvents(courseId: string) {
    return async (dispatch: any) => {
        dispatch({
            type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES,
        });

        try {
            const result = await getEventsAndStagesByCourseId(courseId);
            dispatch({
                type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: EVENTS.FETCH_COURSE_EVENTS_AND_STAGES_FAIL,
                payload: e,
            });
        }
    };
}
