import {
  ACCOUNT_REQUEST,
  ACCOUNT_RECEIVE,
  ACCOUNT_MUTATE
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
    case ACCOUNT_MUTATE: {
      return Object.assign({}, state, {
        ...action.account
      });
    }
    default:
      return state;
  }
}