import {
  CONTACTS_RESTORE,
  CONTACT_REQUEST
} from './actions';

export const initialState = {};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CONTACTS_RESTORE:
    case CONTACT_REQUEST: {
      return Object.assign({}, state, {
        ...action.contacts
      });
    }
    default:
      return state;
  }
}