import { CONTACT_SUBSCRIBE } from './../../messenger/contacts/actions';
import { CHAT_SUBSCRIBE } from './../../messenger/chats/actions';

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