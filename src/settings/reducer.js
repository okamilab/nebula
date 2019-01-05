import {
  SETTINGS_MUTATE
} from './actions';

export const initialState = {
  bzz: '',
  pss: '',
  size: 0
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_MUTATE: {
      return Object.assign({}, state, {
        ...action.settings
      });
    }
    default:
      return state;
  }
}