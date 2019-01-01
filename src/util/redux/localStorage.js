import jsonpack from 'jsonpack';
import LZString from 'lz-string';

export default class LocalStorageMiddleware {
  constructor(key) {
    this.key = key;
  }

  middleware() {
    return (store) => (next) => async (action) => {
      console.log('store, next, action', store, next, action);
      await next(action);
    }
  }

  deriveInitialState(preloadedState) {
    let state;

    const raw = localStorage.getItem(this.key);
    const uncompressed = LZString.decompress(raw);
    if (uncompressed) {
      state = jsonpack.unpack(uncompressed)
    }

    return {
      ...preloadedState,
      appState: { raw, ...state }
    };
  }
}