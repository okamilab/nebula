import {
  CONTACTS_RESTORE
} from './actions';

export const initialState = {
};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CONTACTS_RESTORE: {
      return Object.assign({}, state, {
        ...action.contacts
      });
    }
    default:
      return state;
  }
}