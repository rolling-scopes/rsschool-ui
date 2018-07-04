import { History } from 'history';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import IHotModule from './models/hot-module.model';
import rootReducer from './reducers';
// import rootSaga from './sagas';
import thunk from 'redux-thunk';

declare const module: IHotModule;

const configureStore = (history: History) => {
    const routerMiddleware = createRouterMiddleware(history);
    // const sagaMiddleware = createSagaMiddleware();

    const store = createStore(rootReducer, applyMiddleware(routerMiddleware, thunk));

    // sagaMiddleware.run(rootSaga);

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

export default configureStore;
