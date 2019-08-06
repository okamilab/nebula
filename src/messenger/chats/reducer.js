import sum from 'hash-sum';

import {
  CHATS_RESTORE,
  CHAT_CREATE,
  CHAT_SEND_MESSAGE,
  CHAT_RECEIVE_MESSAGE
} from './actions';

export const initialState = {};

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CHATS_RESTORE:
    case CHAT_CREATE: {
      return Object.assign({}, state, {
        ...action.chats
      });
    }
    case CHAT_SEND_MESSAGE:
    case CHAT_RECEIVE_MESSAGE: {
      const { [action.hash]: chat, ...chats } = state;
      const newChat = Object.assign({}, chat);

      newChat.messages[sum(action.message)] = action.message;
      return Object.assign({}, { [action.hash]: newChat }, chats);
    }
    default:
      return state;
  }
}