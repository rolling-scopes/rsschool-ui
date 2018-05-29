import { COURSES_ENROLL, COURSES_FETCH } from '../constants';

export function fetchCourses() {
    return {
        type: COURSES_FETCH,
    };
}

export function enrollUserInCourse(id: string) {
    return {
        type: COURSES_ENROLL,
        payload: id,
    };
}
