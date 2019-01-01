import { hexValueType } from '@erebos/swarm-browser';
import sum from 'hash-sum';

import keyUtils from './../base/key';

export const CONTACTS_RESTORE = 'SETTINGS_RESTORE';
export const CONTACT_REQUEST = 'CONTACT_REQUEST';

export function restoreContacts(publicKey) {
  return async (dispatch, getState) => {
    const { appState } = getState();
    const contacts = appState[publicKey].contacts;
    dispatch({
      type: CONTACTS_RESTORE,
      contacts
    });
  };
}

export function inviteContact(publicKey) {
  return async (dispatch, getState, client) => {
    const { account, contacts } = getState();
    const publicKeyHex = hexValueType(publicKey);
    const hash = sum(publicKeyHex);

    keyUtils.isValidPubKey(publicKeyHex, account.publicKey, contacts[hash]);

    // TODO: avoid to use messenger, use client
    const { sharedTopic } =
      await this.messenger.sendContactRequest(publicKeyHex, account.username);

    const contact = {
      key: publicKeyHex,
      topic: sharedTopic,
      type: 'sent_request'
    };

    dispatch({
      type: CONTACT_REQUEST,
      contacts: { [hash]: contact }
    });
    return sharedTopic;
  };
}