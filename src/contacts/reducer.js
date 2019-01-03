import {
  CONTACTS_RESTORE,
  CONTACT_REQUEST,
  CONTACT_RECEIVE,
  CONTACT_MUTATE,
  CONTACT_ACCEPT,
  CONTACT_DECLINE
} from './actions';

export const initialState = {};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CONTACTS_RESTORE:
    case CONTACT_REQUEST:
    case CONTACT_RECEIVE:
    case CONTACT_MUTATE:
    case CONTACT_ACCEPT:
    case CONTACT_DECLINE: {
      return Object.assign({}, state, {
        ...action.contacts
      });
    }
    default:
      return state;
  }
}