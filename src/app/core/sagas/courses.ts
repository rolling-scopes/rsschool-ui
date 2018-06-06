import { call, put } from 'redux-saga/effects';
import { enrollUserInCourse as enrollUser, getCourses, assignMentorsToStudents } from '../api';
import { COURSE, COURSES_ENROLL_FAIL, COURSES_ENROLL_OK, COURSES_FETCH_FAIL, COURSES_FETCH_OK } from '../constants';
import { fetchUserParticipations } from './user';
import { ICourse } from '../../core/models';

export function* fetchCourses() {
    try {
        const data: ICourse[] = yield call(getCourses);
        yield put({ type: COURSES_FETCH_OK, payload: data });
    } catch (error) {
        yield put({ type: COURSES_FETCH_FAIL, payload: error });
    }
}

export function* enrollUserInCourse(action: any) {
    try {
        const data = yield call(enrollUser, action.payload);
        yield put({ type: COURSES_ENROLL_OK, payload: data });
        yield fetchUserParticipations();
    } catch (error) {
        yield put({ type: COURSES_ENROLL_FAIL });
    }
}

export function* assignMentors(action: any) {
    try {
        const data = yield call(assignMentorsToStudents, action.payload);
        yield put({ type: COURSE.ASSIGN_MENTORS_OK, payload: data });
    } catch (error) {
        yield put({ type: COURSE.ASSIGN_MENTORS_FAIL });
    }
}
