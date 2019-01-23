import { applyMiddleware, createStore, compose as reduxCompose } from 'redux';
import thunk from 'redux-thunk';
import { SwarmClient } from '@erebos/swarm-browser';

import reducer from './reducer';
import LocalStorageMiddleware from './../util/redux/localStorage';
import { DEFAULT_SETTINGS } from './default';

export function configureStore(initialState) {
  // Use compose function provided by Redux DevTools if the extension is installed.
  const compose = (process.env.NODE_ENV === 'development'
    && typeof window === 'object'
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    || reduxCompose;

  const localStorageMiddleware = new LocalStorageMiddleware('swarm_messenger');
  initialState = localStorageMiddleware.deriveInitialState(initialState);

  const config = {
    bzz: initialState.appState.bzz || DEFAULT_SETTINGS.bzz,
    ws: initialState.appState.pss || DEFAULT_SETTINGS.pss,
  };
  const client = new SwarmClient(config);

  const middleware = [
    localStorageMiddleware.middleware(),
    thunk.withExtraArgument(client)
  ];
  const enhancers = [applyMiddleware(...middleware)];
  const store = createStore(reducer, initialState, compose(...enhancers));

  // Hot-reloading
  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default);
    });
  }

  return store;
}