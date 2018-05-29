import { RouterState, routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { FormState, reducer as formReducer } from 'redux-form';
import { Action } from '../util';
import { CoursesState, coursesReducer } from './courses';
import { EventsState, eventsReducer } from './events';
import { SessionState, sessionReducer } from './session';
import { UserState, userReducer } from './user';

export interface RootState {
    courses: CoursesState;
    events: EventsState;
    form: FormState;
    user: UserState;
    router: RouterState;
    session: SessionState;
}

const rootReducer = combineReducers<RootState, Action<any>>({
    courses: coursesReducer,
    events: eventsReducer,
    form: formReducer as any,
    user: userReducer,
    router: routerReducer as any,
    session: sessionReducer,
});

export default rootReducer;
