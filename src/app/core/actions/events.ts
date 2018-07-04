import { EVENTS } from '../constants';
import { getEventsByCourseId } from '../api';

export function fetchEvents(courseId: string) {
    return async (dispatch: any) => {
        dispatch({
            type: EVENTS.FETCH_COURSE_EVENTS,
        });

        try {
            const result = await getEventsByCourseId(courseId);
            dispatch({
                type: EVENTS.FETCH_COURSE_EVENTS_OK,
                payload: result,
            });
        } catch (e) {
            dispatch({
                type: EVENTS.FETCH_COURSE_EVENTS_FAIL,
            });
        }
    };
}
