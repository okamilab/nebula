import { map, filter } from 'rxjs/operators';
import sum from 'hash-sum';
import FileSaver from 'file-saver';

import { readFile } from './../../base/fn';

export const CHATS_RESTORE = 'CHATS_RESTORE';
export const CHAT_CREATE = 'CHAT_CREATE';
export const CHAT_SUBSCRIBE = 'CHAT_SUBSCRIBE';
export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
export const CHAT_RECEIVE_MESSAGE = 'CHAT_RECEIVE_MESSAGE';

function decodePssEvent(data) {
  return {
    key: data.key,
    data: data.msg.toObject(),
  }
}

function getChat(key, chats) {
  const chat = chats[key];
  if (!chat) {
    throw new Error('Chat is not found');
  }
  return chat;
}

async function createSubscription(client, chat) {
  const [sub] = await Promise.all([
    client.pss.createTopicSubscription(chat.topic),
    client.pss.setPeerPublicKey(chat.key, chat.topic, chat.address),
  ])
  return sub.pipe(
    map(decodePssEvent),
    filter((event) => {
      return event.data.type === 'chat_message' &&
        event.data.payload != null
    }),
    map(
      (event) => ({
        key: event.key,
        type: event.data.type,
        utc_timestamp: event.data.utc_timestamp,
        payload: event.data.payload,
      }),
    ),
  )
}

function handler(dispatch, getState) {
  return async (event) => {
    const { chats } = getState();
    const hash = sum(event.key);
    const chat = getChat(hash, chats);

    const message = {
      sender: hash,
      isRead: false,
      text: event.payload.text,
      timestamp: event.utc_timestamp,
    }

    const existing = chat.messages[sum(message)];
    if (existing) {
      return;
    }

    dispatch({ type: CHAT_RECEIVE_MESSAGE, hash, message });
  }
}

function subscribe(chat) {
  return async (dispatch, getState, resolve) => {
    const { client } = resolve();
    const subscription = await createSubscription(client, chat);
    const sub = subscription.subscribe(handler(dispatch, getState));
    dispatch({ type: CHAT_SUBSCRIBE, sub });
  }
}

function subscribeAll(dispatch, chats) {
  Object.values(chats).map(chat => dispatch(subscribe(chat)));
}

export function restoreChats(publicKey) {
  return async (dispatch, getState) => {
    const { app } = getState();
    const session = app[publicKey] || {};
    const chats = session.chats || {};
    dispatch({ type: CHATS_RESTORE, chats });
    subscribeAll(dispatch, chats);
  };
}

export function createChat(contact) {
  return async (dispatch, getState) => {
    const { account } = getState();
    const hash = sum(contact.key);
    const chat = {
      key: contact.key,
      topic: contact.topic,
      address: contact.address,
      participants: {
        [hash]: contact.key,
        [sum(account.publicKey)]: account.publicKey,
      },
      messages: {}
    }

    dispatch({ type: CHAT_CREATE, chats: { [hash]: chat } });
    dispatch(subscribe(chat));
  };
}

async function send(dispatch, client, chat, publicKey, text) {
  const pssMessage = {
    type: 'chat_message',
    payload: { text },
    utc_timestamp: Date.now()
  };
  await client.pss.sendAsym(chat.key, chat.topic, pssMessage);

  const message = {
    sender: sum(publicKey),
    isRead: true,
    timestamp: Date.now(),
    text
  }

  dispatch({ type: CHAT_SEND_MESSAGE, hash: sum(chat.key), message });
}

export function sendMessage(key, text) {
  return async (dispatch, getState, resolve) => {
    const { account, chats } = getState();
    const chat = getChat(key, chats);
    const { client } = resolve();
    send(dispatch, client, chat, account.publicKey, text);
  };
}

export function sendFile(key, file) {
  return async (dispatch, getState, resolve) => {
    const { account, chats } = getState();
    const chat = getChat(key, chats);

    const { client } = resolve();
    const { bzz } = client;
    const readEvent = await readFile(file);
    const buffer = readEvent.currentTarget.result
    const hash = await bzz.uploadFile(buffer, { contentType: file.type });

    const text = `bzz:/${hash}`;
    send(dispatch, client, chat, account.publicKey, text);
  };
}

export function download(hash) {
  return async (_, __, resolve) => {
    const { client } = resolve();
    const { bzz } = client;
    const file = await bzz.download(hash);
    await FileSaver.saveAs(await file.blob());
  }
}
