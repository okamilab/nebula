import sum from 'hash-sum';
import FileSaver from 'file-saver';

import { readFile } from './../base/fn';

export const CHATS_RESTORE = 'CHATS_RESTORE';
export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';

export function restoreChats(publicKey) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const session = appState[publicKey] || {};
    const chats = session.chats || [];
    dispatch({ type: CHATS_RESTORE, chats });
  };
}

export function sendMessage(key, text) {
  return async (dispatch, getState, client) => {
    const { account, chats } = getState();
    const chat = chats.find(c => c.key === key);
    if (!chat) {
      throw new Error('Chat is not found');
    }

    const pssMessage = {
      type: 'chat_message',
      payload: { text },
      utc_timestamp: Date.now()
    };
    await client.pss.sendAsym(chat.key, chat.topic, pssMessage);

    const message = {
      sender: sum(account.publicKey),
      isRead: true,
      timestamp: Date.now(),
      text
    }

    dispatch({ type: CHAT_SEND_MESSAGE, key, message });
  };
}

// TODO: DRY
export function sendFile(key, file) {
  return async (dispatch, getState, client) => {
    const { account, chats } = getState();
    const chat = chats.find(c => c.key === key);
    if (!chat) {
      throw new Error('Chat is not found');
    }

    const { bzz } = client;
    const readEvent = await readFile(file);
    const buffer = readEvent.currentTarget.result
    const hash = await bzz.uploadFile(buffer, { contentType: file.type });

    const text = 'bzz:/' + hash;
    const pssMessage = {
      type: 'chat_message',
      payload: { text },
      utc_timestamp: Date.now()
    };
    await client.pss.sendAsym(chat.key, chat.topic, pssMessage);

    const message = {
      sender: sum(account.publicKey),
      isRead: true,
      timestamp: Date.now(),
      text
    }

    dispatch({ type: CHAT_SEND_MESSAGE, key, message });
  };
}

export function download(hash) {
  return async (_, __, client) => {
    const { bzz } = client;
    const file = await bzz.download(hash);
    await FileSaver.saveAs(await file.blob());
  }
}
