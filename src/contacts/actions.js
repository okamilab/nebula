import { hexValueType } from '@erebos/swarm-browser';
import { map, filter } from 'rxjs/operators';
import sum from 'hash-sum';

import keyUtils from './../base/key';
import { createChat } from './../chats/actions';

export const CONTACTS_RESTORE = 'CONTACTS_RESTORE';
export const CONTACT_SUBSCRIBE = 'CONTACT_SUBSCRIBE';
export const CONTACT_REQUEST = 'CONTACT_REQUEST';
export const CONTACT_RECEIVE = 'CONTACT_RECEIVE';
export const CONTACT_MUTATE = 'CONTACT_MUTATE';
export const CONTACT_ACCEPT = 'CONTACT_ACCEPT';
export const CONTACT_DECLINE = 'CONTACT_DECLINE';

function decodePssEvent(data) {
  return {
    key: data.key,
    data: data.msg.toObject(),
  }
}

async function createSubscription(client, publicKey) {
  const topic = await client.pss.stringToTopic(publicKey);
  const subscription = await client.pss.createTopicSubscription(topic);
  return subscription.pipe(
    map(decodePssEvent),
    filter((event) => {
      return (
        (event.data.type === 'contact_request' &&
          event.data.payload != null &&
          event.data.payload.topic != null) ||
        event.data.type === 'contact_response'
      )
    }),
    map(
      (event) => ({
        key: event.key,
        type: event.data.type,
        payload: event.data.payload,
      }),
    ),
  )
}

function handler(dispatch, getState) {
  return async (event) => {
    const { contacts } = getState();
    const hash = sum(event.key);
    const existing = contacts[hash];

    if (
      event.type === 'contact_request' &&
      (existing == null || existing.type === 'received_request')
    ) {
      // New contact or update existing with new payload
      const contact = {
        key: event.key,
        type: 'received_request',
        topic: event.payload.topic,
        username: event.payload.username,
        address: event.payload.overlay_address,
      };

      dispatch({ type: CONTACT_RECEIVE, contacts: { [hash]: contact } });
    } else if (
      event.type === 'contact_response' &&
      existing != null &&
      (existing.type === 'sent_declined' ||
        existing.type === 'sent_request')
    ) {
      // Response from contact, set type to 'added' or 'sent_declined' accordingly
      const contact = {
        ...existing,
        type: event.payload.contact === true ? 'added' : 'sent_declined',
        username: event.payload.username,
        address: event.payload.overlay_address,
      }

      dispatch({ type: CONTACT_MUTATE, contacts: { [hash]: contact } });
      if (event.payload.contact) {
        dispatch(createChat(contact));
      }
    } else {
      console.error('unhandled event', event);
      return;
    }
  }
}

export function subscribe() {
  return async (dispatch, getState, client) => {
    const { account } = getState();

    const subscription = await createSubscription(client, account.publicKey);
    const sub = subscription.subscribe(handler(dispatch, getState));
    dispatch({ type: CONTACT_SUBSCRIBE, sub });
  }
}

export function restoreContacts(publicKey) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const session = appState[publicKey] || {};
    const contacts = session.contacts || {};
    dispatch({ type: CONTACTS_RESTORE, contacts });
    dispatch(subscribe());
  };
}

function createRandomString() {
  return Math.random()
    .toString(36)
    .slice(2);
}

export function inviteContact(publicKey) {
  return async (dispatch, getState, client) => {
    const { account, contacts } = getState();
    const publicKeyHex = hexValueType(publicKey);
    const hash = sum(publicKeyHex);

    keyUtils.isValidPubKey(publicKeyHex, account.publicKey, contacts[hash]);

    const [contactTopic, sharedTopic] = await Promise.all([
      client.pss.stringToTopic(publicKeyHex),
      client.pss.stringToTopic(createRandomString()),
    ]);

    await client.pss.setPeerPublicKey(publicKeyHex, contactTopic);
    const pssMessage = {
      type: 'contact_request',
      payload: {
        username: account.username,
        message: null,
        topic: sharedTopic,
        overlay_address: account.overlayAddress,
      },
      utc_timestamp: Date.now()
    };
    await client.pss.sendAsym(publicKeyHex, contactTopic, pssMessage);

    const contact = {
      key: publicKeyHex,
      topic: sharedTopic,
      type: 'sent_request'
    };

    dispatch({ type: CONTACT_REQUEST, contacts: { [hash]: contact } });
  };
}

async function sendResponse(client, overlayAddress, key, accept, data = {}) {
  let payload = { contact: accept }
  if (accept) {
    payload = {
      ...payload,
      username: data.username,
      overlay_address: overlayAddress,
    };
  }

  const topic = await client.pss.stringToTopic(key);
  await client.pss.setPeerPublicKey(key, topic);
  const message = {
    type: 'contact_response',
    payload,
    utc_timestamp: Date.now()
  };
  await client.pss.sendAsym(key, topic, message);
}

export function acceptContact(publicKey) {
  return async (dispatch, getState, client) => {
    const { account, contacts } = getState();
    await sendResponse(client, account.overlayAddress, publicKey, true, { username: account.username });

    const hash = sum(publicKey);
    const contact = {
      ...contacts[hash],
      type: 'added'
    };

    dispatch({ type: CONTACT_ACCEPT, contacts: { [hash]: contact } });
    dispatch(createChat(contact));
  }
}

export function declineContact(publicKey) {
  return async (dispatch, getState, client) => {
    const { account, contacts } = getState();
    await sendResponse(client, account.overlayAddress, publicKey, false, { username: account.username });

    const hash = sum(publicKey);
    const contact = {
      ...contacts[hash],
      type: 'received_declined'
    };

    dispatch({ type: CONTACT_DECLINE, contacts: { [hash]: contact } });
  }
}