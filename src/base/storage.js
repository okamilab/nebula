const STORAGE_KEY = 'swarm_messenger';

// Structure:
// {
//     endpoint: 'ws://127.0.0.1:8546',
//     [publicKey]: {
//         username: '',
//         contacts: [],
//         chats: []
//     }
// }

export default {
    set(data) {
        const value = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, value);
    },

    get() {
        const value = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(value || '{}');
    },

    getRaw() {
        return localStorage.getItem(STORAGE_KEY);
    }
}