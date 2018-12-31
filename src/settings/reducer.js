import {
  SETTINGS_RESTORE,
  SETTINGS_MUTATE
} from './actions';

export const initialState = {
  bzz: '',
  pss: '',
  raw: ''
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_RESTORE: {
      return Object.assign({}, state, {
        ...action.settings
      });
    }
    case SETTINGS_MUTATE: {
      return Object.assign({}, state, {
        ...action.settings
      });
    }
    default:
      return state;
  }
}