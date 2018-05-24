import { call, put } from 'redux-saga/effects';
import { getSession } from '../api';
import { SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';

type SessionResponse = {
    data: { id: string };
};

export function* fetchSession(action: any) {
    try {
        const response: SessionResponse = yield call<SessionResponse>(getSession, action.payload);
        yield put({ type: SESSION_FETCH_OK, payload: response.data });
    } catch (error) {
        yield put({ type: SESSION_FETCH_FAIL, payload: error });
    }
}
