
export default {
    addContact(data) {
        localStorage.setItem('swarm_messenger', data);
    },

    getContact() {
        localStorage.setItem('swarm_messenger');
    }
}