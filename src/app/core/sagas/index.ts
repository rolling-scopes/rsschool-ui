import { takeLatest } from 'redux-saga/effects';
import { EVENTS_FETCH, PROFILE_FETCH, PROFILE_UPDATE, SESSION_FETCH } from '../constants';
import { fetchEvents } from './events';
import { fetchProfile, updateProfile } from './profile';
import { fetchSession } from './session';

export default function* watch() {
    yield takeLatest(EVENTS_FETCH, fetchEvents);
    yield takeLatest(SESSION_FETCH, fetchSession);
    yield takeLatest(PROFILE_UPDATE, updateProfile);
    yield takeLatest(PROFILE_FETCH, fetchProfile);
}
