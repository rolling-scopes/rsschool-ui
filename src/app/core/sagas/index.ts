import { takeLatest } from 'redux-saga/effects';
import { EVENTS_FETCH, SESSION_FETCH } from '../constants';
import { fetchEvents } from './events';
import { fetchSession } from './session';

export default function* watch() {
    yield takeLatest(EVENTS_FETCH, fetchEvents);
    yield takeLatest(SESSION_FETCH, fetchSession);
}
