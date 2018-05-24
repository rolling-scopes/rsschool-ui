import { RouterState, routerReducer } from 'react-router-redux';
import { Reducer, combineReducers } from 'redux';
import { EventsState, eventsReducer } from './events';
import { sessionReducer } from './session';

export interface RootState {
    router: RouterState;
}

const rootReducer = combineReducers<RootState>({
    router: routerReducer,
    events: eventsReducer,
    session: sessionReducer,
});

export default rootReducer;
