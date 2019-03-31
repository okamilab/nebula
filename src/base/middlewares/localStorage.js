import jsonpack from 'jsonpack';
import LZString from 'lz-string';

import { DEFAULT_SETTINGS } from './../../base/default';

export default class LocalStorageMiddleware {
  constructor(key) {
    this.key = key;
    this.trackFields = [
      'account.username',
      'settings.pss',
      'settings.bzz',
      'settings.revealAddress',
      'contacts',
      'chats'
    ];
    this.excludeActionTypes = [
      'ACCOUNT_REQUEST',
      'ACCOUNT_RECEIVE',
      'CONTACTS_RESTORE',
      'CONTACT_SUBSCRIBE',
      'CHATS_RESTORE',
      'CHAT_SUBSCRIBE',
    ];
  }

  middleware() {
    const get = (state, path) => {
      const parts = path.split('.');
      let value = state;

      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];

        if (Object.hasOwnProperty.call(value, part)) {
          value = value[part];
        } else {
          return undefined;
        }
      }

      return value;
    };

    const storeState = (state, publicKey) => {
      const { pss, bzz, revealAddress } = state.settings;
      const username = get(state, 'account.username');
      const model = {
        pss,
        bzz,
        revealAddress,
        [publicKey]: {
          username,
          contacts: state.contacts,
          chats: state.chats,
        }
      };

      const value = jsonpack.pack(model);
      const compressed = LZString.compress(value);
      localStorage.setItem(this.key, compressed);
    }

    return (store) => (next) => async (action) => {
      const prevState = store.getState();
      await next(action);
      if (!action.type || this.excludeActionTypes.includes(action.type)) {
        return;
      }

      const nextState = store.getState();
      const diff = this.trackFields.some(v => {
        const prev = get(prevState, v);
        const next = get(nextState, v);
        return prev !== next;
      })


      const publicKey = get(nextState, 'account.publicKey');
      if (diff && publicKey) {
        storeState(nextState, publicKey);
      }
    }
  }

  deriveInitialState(preloadedState) {
    let state = {};

    const raw = localStorage.getItem(this.key);
    const uncompressed = LZString.decompress(raw);
    if (uncompressed) {
      state = jsonpack.unpack(uncompressed)
    }

    return {
      ...preloadedState,
      app: { raw, ...state },
      settings: {
        pss: state.pss || DEFAULT_SETTINGS.pss,
        bzz: state.bzz || DEFAULT_SETTINGS.bzz,
        revealAddress: state.revealAddress || DEFAULT_SETTINGS.revealAddress,
        size: (raw || '').length,
      }
    };
  }
}