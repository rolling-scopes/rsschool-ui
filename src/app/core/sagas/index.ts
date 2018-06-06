import { takeLatest, all } from 'redux-saga/effects';
import { COURSE, COURSES_ENROLL, COURSES_FETCH, EVENTS_FETCH, SESSION_FETCH, USER } from '../constants';
import { enrollUserInCourse, fetchCourses, assignMentors } from './courses';
import { fetchEvents } from './events';
import { fetchSession } from './session';
import { fetchFeed, fetchProfile, fetchUserParticipations, updateProfile } from './user';

function* watchUser() {
    yield takeLatest(USER.PROFILE_UPDATE, updateProfile);
    yield takeLatest(USER.PROFILE_FETCH, fetchProfile);
    yield takeLatest(USER.PARTICIPATIONS_FETCH, fetchUserParticipations);
    yield takeLatest(USER.FEED_FETCH, fetchFeed);
}

function* watchCourse() {
    yield takeLatest(COURSES_FETCH, fetchCourses);
    yield takeLatest(COURSES_ENROLL, enrollUserInCourse);
    yield takeLatest(COURSE.ASSIGN_MENTORS, assignMentors);
}

export default function* watch() {
    yield takeLatest(EVENTS_FETCH, fetchEvents);
    yield takeLatest(SESSION_FETCH, fetchSession);

    yield all([watchUser(), watchCourse()]);
}
