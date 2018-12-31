import {
  ACCOUNT_REQUEST,
  ACCOUNT_RECEIVE
} from './actions';

export const initialState = {
  isLoading: false,
  publicKey: '',
  overlayAddress: '',
  username: ''
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_REQUEST: {
      return Object.assign({}, state, {
        isLoading: true
      });
    }
    case ACCOUNT_RECEIVE: {
      return Object.assign({}, state, {
        isLoading: false,
        ...action.account
      });
    }
    default:
      return state;
  }
}