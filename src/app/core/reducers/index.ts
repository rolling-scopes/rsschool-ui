import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';

export interface RootState {
    router: RouterState;
}

const rootReducer = combineReducers<RootState>({
    router: routerReducer,
});

export default rootReducer;
