import { createStore } from 'redux';

import reducer from './reducer';

export function configureStore(initialState) {
  const store = createStore(reducer, initialState);

  // DEV: Hot-reloading
  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer').default);
    });
  }

  return store;
}