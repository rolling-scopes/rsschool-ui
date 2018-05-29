import { call, put } from 'redux-saga/effects';
import * as api from '../api';
import { PROFILE_FETCH_FAIL, PROFILE_FETCH_OK, PROFILE_UPDATE_FAIL, PROFILE_UPDATE_OK } from '../constants';
import { IProfile } from '../models';
import { Action } from '../util';

type Profile = IProfile;

export function* updateProfile(action: Action<any>) {
    try {
        const data: Profile = yield call<Profile>(api.updateProfile, action.payload);
        yield put({ type: PROFILE_UPDATE_OK, payload: data });
    } catch (error) {
        yield put({ type: PROFILE_UPDATE_FAIL, payload: error });
    }
}

export function* fetchProfile(action: Action<any>) {
    try {
        const data: Profile = yield call(api.getProfile);
        yield put({ type: PROFILE_FETCH_OK, payload: data });
    } catch (error) {
        yield put({ type: PROFILE_FETCH_FAIL, payload: error });
    }
}
