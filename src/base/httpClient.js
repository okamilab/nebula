import axios from 'axios';

export function createHttpClient() {
    let client = axios.create({
        baseURL: process.env.REACT_APP_API_ENDPOINT
    });

    return client;
}