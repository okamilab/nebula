import jsonpack from 'jsonpack';
import LZString from 'lz-string';

const STORAGE_KEY = 'swarm_messenger';

// Structure:
// {
//   endpoint: 'ws://127.0.0.1:8546',
//   [publicKey]: {
//       username: '',
//       contacts: {
//           [hash(publicKey)]: {},
//           ...
//       },
//       chats: [
//           {
//               participants: {
//                    [hash(publicKey)]: publicKey,
//                    ...
//               },
//               messeges: {
//                   [hash(event)]: {
//                       sender: [hash(publicKey)],
//                       ...
//                   },
//                   ...
//               }
//           },
//           ...
//       ]
//   }
// }

export default {
  set(data) {
    const value = jsonpack.pack(data);
    const compressed = LZString.compress(value);
    localStorage.setItem(STORAGE_KEY, compressed);
  },

  get() {
    const value = localStorage.getItem(STORAGE_KEY);
    const uncompressed = LZString.decompress(value);
    return uncompressed ? jsonpack.unpack(uncompressed) : {};
  },

  getRaw() {
    return localStorage.getItem(STORAGE_KEY);
  }
}