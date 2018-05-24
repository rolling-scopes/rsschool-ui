import { call, put } from 'redux-saga/effects';
import { getEventsByCourseId } from '../api';
import { EVENTS_FETCH_FAIL, EVENTS_FETCH_OK } from '../constants';

export function* fetchEvents(action: any) {
    try {
        const response: { data: { data: any[] } } = yield call(getEventsByCourseId, action.payload);
        yield put({ type: EVENTS_FETCH_OK, payload: response.data.data });
    } catch (error) {
        yield put({ type: EVENTS_FETCH_FAIL, payload: error });
    }
}
