import {
  APP_CONNECTED,
  APP_DISCONNECTED
} from './actions';

export const initialState = {
  isStarted: false,
  isConnected: false,
  raw: ''
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case APP_CONNECTED: {
      return Object.assign({}, state, {
        isStarted: true,
        isConnected: true
      });
    }
    case APP_DISCONNECTED: {
      return Object.assign({}, state, {
        isStarted: true,
        isConnected: false
      });
    }
    default:
      return state;
  }
}