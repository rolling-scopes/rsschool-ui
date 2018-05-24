import { getEventsByCourseId } from '../api';
import { EVENTS_FETCH, SESSION_FETCH } from '../constants';

export function fetchEvents(courseId: string) {
    return {
        type: EVENTS_FETCH,
        payload: courseId,
    };
}

export function fetchSession() {
    return {
        type: SESSION_FETCH,
    };
}
