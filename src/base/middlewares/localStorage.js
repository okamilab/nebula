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

    const storeState = (state) => {
      const { pss, bzz, revealAddress } = state.settings;

      const model = {
        ...this.unpack(state.app.raw),
        ...{
          pss,
          bzz,
          revealAddress
        }
      };

      const publicKey = get(state, 'account.publicKey');
      if (publicKey) {
        const username = get(state, 'account.username');
        model[publicKey] = {
          username,
          contacts: state.contacts,
          chats: state.chats,
        };
      }

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

      if (diff) {
        storeState(nextState);
      }
    }
  }

  deriveInitialState(preloadedState) {
    const raw = localStorage.getItem(this.key);
    const state = this.unpack(raw);

    return {
      ...preloadedState,
      app: { raw, ...state },
      settings: {
        pss: state.pss || DEFAULT_SETTINGS.pss,
        bzz: state.bzz || DEFAULT_SETTINGS.bzz,
        revealAddress: state.revealAddress === undefined ? DEFAULT_SETTINGS.revealAddress : state.revealAddress,
        size: (raw || '').length,
      }
    };
  }

  unpack(raw) {
    const uncompressed = LZString.decompress(raw);
    return uncompressed ? jsonpack.unpack(uncompressed) : {};
  }
}