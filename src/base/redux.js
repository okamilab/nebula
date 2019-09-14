import { applyMiddleware, createStore, compose as reduxCompose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import reducer from './reducer';
import LocalStorageMiddleware from './middlewares/localStorage';
import ClientResolver from './client';

export const history = createHashHistory();

export function configureStore(initialState) {
  // Use compose function provided by Redux DevTools if the extension is installed.
  const compose = (process.env.NODE_ENV === 'development'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    || reduxCompose;

  const localStorageMiddleware = new LocalStorageMiddleware('nebula');
  initialState = localStorageMiddleware.deriveInitialState(initialState);

  const config = {
    bzz: initialState.settings.bzz,
    ws: initialState.settings.pss,
  };
  const clientResolver = new ClientResolver(config);

  const middleware = [
    routerMiddleware(history),
    localStorageMiddleware.middleware(),
    thunk.withExtraArgument(() => {
      return {
        client: clientResolver.client,
        connection: clientResolver.subject.connectionStatus
      }
    })
  ];
  const enhancers = [applyMiddleware(...middleware)];
  const store = createStore(reducer(history), initialState, compose(...enhancers));

  // Hot-reloading
  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default);
    });
  }

  return store;
}