import { push } from 'connected-react-router';

import { inviteContact } from './../messenger/contacts/actions';

export const CHAT_OPEN = '@NEBULA::CHAT_OPEN';

function open(store, { publicKey }) {
  const { dispatch, getState } = store;
  const state = getState();

  const chat = state.chats.find(x => x.key === publicKey);
  if (chat) {
    dispatch(push(`/messenger/chat/${chat.key}`));
    return;
  }

  dispatch(inviteContact(publicKey));
}

export const registry = {
  [CHAT_OPEN]: open
};