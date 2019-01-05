import {
  ERROR_CATCHED,
  ERROR_DISMISS
} from './actions';

export const initialState = [];

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ERROR_CATCHED: {
      return [...state, action.error];
    }
    case ERROR_DISMISS: {
      return state.filter((error) => error !== action.error);
    }
    default:
      return state;
  }
}