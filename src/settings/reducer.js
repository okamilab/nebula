import {
  SETTINGS_MUTATE
} from './actions';

export const initialState = {
  bzz: '',
  pss: '',
  revealAddress: 0,
  size: 0,
  mode: 'full',
  home: '/'
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