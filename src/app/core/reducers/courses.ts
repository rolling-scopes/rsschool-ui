import { COURSES_FETCH, COURSES_FETCH_FAIL, COURSES_FETCH_OK } from '../constants';
import { ICourse } from '../models';
import { Action } from '../util';

export type CoursesState = {
    data: ICourse[];
    error: any;
    isLoading: boolean;
};

const initialState: CoursesState = {
    data: [],
    error: undefined,
    isLoading: false,
};

export function coursesReducer(state = initialState, action: Action<any>): CoursesState {
    if (action.type === COURSES_FETCH) {
        return {
            ...state,
            isLoading: true,
            data: [],
        };
    }
    if (action.type === COURSES_FETCH_OK) {
        return {
            ...state,
            isLoading: false,
            data: action.payload,
        };
    }
    if (action.type === COURSES_FETCH_FAIL) {
        return {
            data: [],
            isLoading: false,
            error: action.payload,
        };
    }
    return state;
}
