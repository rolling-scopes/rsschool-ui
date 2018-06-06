import { call, put } from 'redux-saga/effects';
import { enrollUserInCourse as enrollUser, getCourses, assignMentorsToStudents } from '../api';
import { COURSE, COURSES_ENROLL_FAIL, COURSES_ENROLL_OK, COURSES_FETCH_FAIL, COURSES_FETCH_OK } from '../constants';
import { fetchUserParticipations } from './user';

export function* fetchCourses() {
    try {
        const response: any[] = yield call(getCourses);
        yield put({ type: COURSES_FETCH_OK, payload: response });
    } catch (error) {
        yield put({ type: COURSES_FETCH_FAIL, payload: error });
    }
}

export function* enrollUserInCourse(action: any) {
    try {
        const _ = yield call(enrollUser, action.payload);
        yield put({ type: COURSES_ENROLL_OK, data: _ });
        yield fetchUserParticipations();
    } catch (error) {
        yield put({ type: COURSES_ENROLL_FAIL });
    }
}

export function* assignMentors(action: any) {
    try {
        const _ = yield call(assignMentorsToStudents, action.payload);
        yield put({ type: COURSE.ASSIGN_MENTORS_OK, data: _ });
    } catch (error) {
        yield put({ type: COURSE.ASSIGN_MENTORS_FAIL });
    }
}
