import { COURSE } from '../constants';
import { ICourseMentor, ICourseStudent } from '../models';
import { Action } from '../util';

export type CourseState = {
    students: ICourseStudent[];
    mentors: ICourseMentor[];
    error: any;
};

const initialState: CourseState = {
    students: [],
    mentors: [],
    error: undefined,
};

export function courseReducer(state = initialState, action: Action<any>): CourseState {
    if (action.type === COURSE.FETCH_MENTORS_OK) {
        return {
            ...state,
            mentors: action.payload,
        };
    }
    if (action.type === COURSE.FETCH_STUDENTS_OK) {
        return {
            ...state,
            students: action.payload,
        };
    }
    return state;
}
