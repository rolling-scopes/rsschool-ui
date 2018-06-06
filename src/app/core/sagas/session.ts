import { call, put } from 'redux-saga/effects';
import { getSession } from '../api';
import { SESSION_FETCH_FAIL, SESSION_FETCH_OK } from '../constants';
import { IUserSession } from 'core/models';

export function* fetchSession(action: any) {
    try {
        const session: IUserSession = yield call<IUserSession>(getSession, action.payload);
        yield put({ type: SESSION_FETCH_OK, payload: session });
    } catch (error) {
        yield put({ type: SESSION_FETCH_FAIL, payload: error });
    }
}
