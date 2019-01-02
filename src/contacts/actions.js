import { hexValueType } from '@erebos/swarm-browser';
import sum from 'hash-sum';

import keyUtils from './../base/key';

export const CONTACTS_RESTORE = 'CONTACTS_RESTORE';
export const CONTACT_REQUEST = 'CONTACT_REQUEST';

export function restoreContacts(publicKey) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const session = appState[publicKey] || {};
    const contacts = session.contacts || {};
    dispatch({
      type: CONTACTS_RESTORE,
      contacts
    });
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

    dispatch({
      type: CONTACT_REQUEST,
      contacts: { [hash]: contact }
    });
  };
}