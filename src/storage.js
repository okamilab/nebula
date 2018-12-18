
export default {
    set(data) {
        localStorage.setItem('swarm_messenger', data);
    },

    get() {
        localStorage.setItem('swarm_messenger');
    }
}