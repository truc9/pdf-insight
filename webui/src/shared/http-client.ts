import axios, { AxiosRequestConfig } from 'axios';

type Dynamic = any;

function buildAPIUrl(url: string) {
    return `http://localhost:8080/${url}`;
}

async function post(url: string, data: Dynamic, config?: AxiosRequestConfig) {
    const response = await axios.post(buildAPIUrl(url), data, config);
    return response.data;
}

async function get(url: string) {
    const response = await axios.get(buildAPIUrl(url));
    return response.data;
}

async function* streaming(url: string, body?: any) {
    const apiUrl = buildAPIUrl(url);
    let fetchFn: Promise<Response>;
    if (body) {
        fetchFn = fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    else {
        fetchFn = fetch(apiUrl, {
            method: 'GET'
        });
    }

    const response = await fetchFn;
    const reader = response.body?.getReader();
    if (!reader) {
        return;
    }

    while (true!) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const decoded = new TextDecoder().decode(value);
        yield decoded;
    }
}

export default {
    post,
    get,
    streaming
};