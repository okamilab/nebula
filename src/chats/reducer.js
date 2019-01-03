import sum from 'hash-sum';

import {
  CHATS_RESTORE,
  CHAT_CREATE,
  CHAT_SEND_MESSAGE,
  CHAT_RECEIVE_MESSAGE
} from './actions';

export const initialState = [];

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case CHATS_RESTORE: {
      return Object.assign([], state, [
        ...action.chats
      ]);
    }
    case CHAT_CREATE: {
      return [...state, action.chat];
    }
    case CHAT_SEND_MESSAGE:
    case CHAT_RECEIVE_MESSAGE: {
      return state.map((chat) => {
        if (chat.key !== action.key) {
          return chat
        }

        chat.messages[sum(action.message)] = action.message;
        return { ...chat };
      })
    }
    default:
      return state;
  }
}