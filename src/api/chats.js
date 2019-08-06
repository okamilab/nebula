import { push } from 'connected-react-router';
import sum from 'hash-sum';

import { inviteContact } from './../messenger/contacts/actions';

export const CHAT_OPEN = '@NEBULA::CHAT_OPEN';

function open(store, { publicKey }) {
  const { dispatch, getState } = store;
  const state = getState();
  const hash = sum(publicKey);

  const chat = state.chats[hash];
  if (chat) {
    dispatch(push(`/messenger/chat/${hash}`));
    return;
  }

  dispatch(inviteContact(publicKey));
}

export const registry = {
  [CHAT_OPEN]: open
};