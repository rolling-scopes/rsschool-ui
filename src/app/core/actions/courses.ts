import { COURSES_ENROLL, COURSES_FETCH, COURSE } from '../constants';

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

export function assignMentors(id: string) {
    return {
        type: COURSE.ASSIGN_MENTORS,
        payload: id,
    };
}
