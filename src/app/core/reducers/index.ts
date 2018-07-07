import { RouterState, routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { FormState, reducer as formReducer } from 'redux-form';
import { Action } from '../util';
import { CoursesState, coursesReducer } from './courses';
import { EventsState, eventsReducer } from './events';
import { UserState, userReducer } from './user';
import { CourseState, courseReducer } from './course';

export interface RootState {
    courses: CoursesState;
    course: CourseState;
    events: EventsState;
    form: FormState;
    user: UserState;
    router: RouterState;
}

const rootReducer = combineReducers<RootState, Action<any>>({
    courses: coursesReducer,
    course: courseReducer,
    events: eventsReducer as any,
    form: formReducer as any,
    user: userReducer,
    router: routerReducer as any,
});

export default rootReducer;
