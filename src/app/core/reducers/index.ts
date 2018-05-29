import { RouterState, routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { EventsState, eventsReducer } from './events';
import { ProfileState, profileReducer } from './profile';
import { SessionState, sessionReducer } from './session';

export interface RootState {
    router: RouterState;
    profile: ProfileState;
    events: EventsState;
    session: SessionState;
}

const rootReducer = combineReducers<RootState>({
    events: eventsReducer,
    form: formReducer,
    router: routerReducer,
    session: sessionReducer,
    profile: profileReducer,
});

export default rootReducer;
