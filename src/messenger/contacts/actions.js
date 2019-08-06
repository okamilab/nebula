import { hexValueType } from '@erebos/swarm-browser';
import { map, filter } from 'rxjs/operators';
import sum from 'hash-sum';

import keyUtils from './../../base/key';
import { createChat } from './../chats/actions';
import { getAddress } from './../../base/fn';

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
      event.type === 'contact_request' &&
      (existing == null || existing.type === 'added')
    ) {
      // Automatically accept exesting contact
      const contact = {
        ...existing,
        topic: event.payload.topic,
        username: event.payload.username,
        address: event.payload.overlay_address,
      }

      dispatch({ type: CONTACT_MUTATE, contacts: { [hash]: contact } });
      dispatch(acceptContact(event.key, event.payload.overlay_address));
    } else if (
      event.type === 'contact_response' &&
      event.payload.contact &&
      existing != null &&
      (existing.type === 'sent_declined' || existing.type === 'sent_request')
    ) {
      // Response from contact, set type to 'added'
      const contact = {
        ...existing,
        type: 'added',
        username: event.payload.username,
        address: event.payload.overlay_address,
      }

      dispatch({ type: CONTACT_MUTATE, contacts: { [hash]: contact } });
      dispatch(createChat(contact));
    } else if (
      event.type === 'contact_response' &&
      !event.payload.contact &&
      existing != null &&
      (existing.type === 'sent_declined' || existing.type === 'sent_request')
    ) {
      // Declined contact should be erased from the contact list
      dispatch({ type: CONTACT_DECLINE, hash });
    } else {
      console.error('unhandled event', event);
      return;
    }
  }
}

export function subscribe() {
  return async (dispatch, getState, resolve) => {
    const { account } = getState();
    const { client } = resolve();
    const subscription = await createSubscription(client, account.publicKey);
    const sub = subscription.subscribe(handler(dispatch, getState));
    dispatch({ type: CONTACT_SUBSCRIBE, sub });
  }
}

export function restoreContacts(publicKey) {
  return async (dispatch, getState) => {
    const { app } = getState();
    const session = app[publicKey] || {};
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

export function inviteContact(publicKey, address) {
  return async (dispatch, getState, resolve) => {
    const { account, contacts, settings } = getState();
    const publicKeyHex = hexValueType(publicKey);
    const hash = sum(publicKeyHex);

    keyUtils.isValidPubKey(publicKeyHex, account.publicKey, contacts[hash]);

    const { client } = resolve();
    const [contactTopic, sharedTopic] = await Promise.all([
      client.pss.stringToTopic(publicKeyHex),
      client.pss.stringToTopic(createRandomString()),
    ]);

    await client.pss.setPeerPublicKey(publicKeyHex, contactTopic, address || '0x');
    const pssMessage = {
      type: 'contact_request',
      payload: {
        username: account.username,
        message: null,
        topic: sharedTopic,
        overlay_address: getAddress(account.overlayAddress, settings.revealAddress),
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

async function sendResponse(client, getState, publicKey, address, accept) {
  const topic = await client.pss.stringToTopic(publicKey);
  let payload = { contact: accept };

  if (accept) {
    const { account, settings } = getState();
    payload = {
      ...payload,
      username: account.username,
      overlay_address: getAddress(account.overlayAddress, settings.revealAddress),
    };

    await client.pss.setPeerPublicKey(publicKey, topic, address || '0x');
  }

  const message = {
    type: 'contact_response',
    payload,
    utc_timestamp: Date.now()
  };
  await client.pss.sendAsym(publicKey, topic, message);
}

export function acceptContact(publicKey, address) {
  return async (dispatch, getState, resolve) => {
    const { contacts } = getState();
    const { client } = resolve();
    await sendResponse(client, getState, publicKey, address, true);

    const hash = sum(publicKey);
    const contact = {
      ...contacts[hash],
      type: 'added'
    };

    dispatch({ type: CONTACT_ACCEPT, contacts: { [hash]: contact } });
    dispatch(createChat(contact));
  }
}

export function declineContact(publicKey, address) {
  return async (dispatch, getState, resolve) => {
    const { client } = resolve();
    await sendResponse(client, getState, publicKey, address, false);

    const hash = sum(publicKey);
    dispatch({ type: CONTACT_DECLINE, hash });
  }
}