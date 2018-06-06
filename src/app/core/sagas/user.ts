import { call, put } from 'redux-saga/effects';
import * as api from '../api';
import { USER } from '../constants';
import { IProfile } from '../models';
import { Action } from '../util';

type Profile = IProfile;

export function* updateProfile(action: Action<any>) {
    try {
        const data: Profile = yield call<Profile>(api.updateProfile, action.payload);
        yield put({ type: USER.PROFILE_UPDATE_OK, payload: data });
    } catch (error) {
        yield put({ type: USER.PROFILE_UPDATE_FAIL, payload: error });
    }
}

export function* fetchProfile() {
    try {
        const data: Profile = yield call(api.getProfile);
        yield put({ type: USER.PROFILE_FETCH_OK, payload: data });
    } catch (error) {
        yield put({ type: USER.PROFILE_FETCH_FAIL, payload: error });
    }
}

export function* fetchUserParticipations() {
    try {
        const data = yield call(api.getUserParticipations);
        yield put({ type: USER.PARTICIPATIONS_FETCH_OK, payload: data });
    } catch (error) {
        yield put({ type: USER.PARTICIPATIONS_FETCH_FAIL, payload: error });
    }
}

export function* fetchFeed() {
    try {
        const data: Profile = yield call(api.getFeed);
        yield put({ type: USER.FEED_FETCH_OK, payload: data });
    } catch (error) {
        yield put({ type: USER.FEED_FETCH_FAIL, payload: error });
    }
}
