import { CONTACT_SUBSCRIBE } from './../../contacts/actions';
import { CHAT_SUBSCRIBE } from './../../chats/actions';

export const initialState = [];

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CHAT_SUBSCRIBE:
    case CONTACT_SUBSCRIBE: {
      return [...state, action.sub];
    }
    default:
      return state;
  }
}