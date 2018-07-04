import { COURSE } from 'core/constants';
import {
    getCourses,
    enrollUserInCourse as enrollUser,
    assignMentorsToStudents,
    getCourseStudents,
    getCourseMentors,
} from 'core/api';
import { ICourse } from 'core/models';

export function fetchAllCourses() {
    return async (dispatch: any) => {
        dispatch({
            type: COURSE.FETCH_ALL_COURSES,
        });

        try {
            const data: ICourse[] = await getCourses();
            dispatch({
                type: COURSE.FETCH_ALL_COURSES_OK,
                payload: data,
            });
        } catch (e) {
            dispatch({
                type: COURSE.FETCH_ALL_COURSES_FAIL,
            });
        }
    };
}

export function enrollUserInCourse(id: string) {
    return async (dispatch: any) => {
        dispatch({
            type: COURSE.ENROLL,
        });

        try {
            const data = await enrollUser(id);
            dispatch({
                type: COURSE.ENROLL_OK,
                payload: data,
            });
        } catch (e) {
            dispatch({
                type: COURSE.ENROLL_FAIL,
            });
        }
    };
}

export function assignMentors(id: string) {
    return async (dispatch: any) => {
        dispatch({
            type: COURSE.ASSIGN_MENTORS,
        });

        try {
            const data = await assignMentorsToStudents(id);
            dispatch({
                type: COURSE.ASSIGN_MENTORS_OK,
                payload: data,
            });
        } catch (e) {
            dispatch({
                type: COURSE.ASSIGN_MENTORS_FAIL,
            });
        }
    };
}

export function fetchCourseStudents(courseId: string) {
    return async (dispatch: any) => {
        dispatch({
            type: COURSE.FETCH_STUDENTS,
        });

        try {
            const data = await getCourseStudents(courseId);
            dispatch({
                type: COURSE.FETCH_STUDENTS_OK,
                payload: data,
            });
        } catch (e) {
            dispatch({
                type: COURSE.FETCH_STUDENTS_FAIL,
            });
        }
    };
}
export function fetchCourseMentors(courseId: string) {
    return async (dispatch: any) => {
        dispatch({
            type: COURSE.FETCH_MENTORS,
        });

        try {
            const data = await getCourseMentors(courseId);
            dispatch({
                type: COURSE.FETCH_MENTORS_OK,
                payload: data,
            });
        } catch (e) {
            dispatch({
                type: COURSE.FETCH_MENTORS_FAIL,
            });
        }
    };
}
