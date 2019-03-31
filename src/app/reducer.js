import {
  APP_CONNECTED,
  APP_DISCONNECTED
} from './actions';

export const initialState = {
  connected: false,
  raw: ''
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case APP_CONNECTED: {
      return Object.assign({}, state, {
        connected: true
      });
    }
    case APP_DISCONNECTED: {
      return Object.assign({}, state, {
        connected: false
      });
    }
    default:
      return state;
  }
}