import axios from 'axios'

type dynamic = any

function apiUrl(url: string) {
    return `http://localhost:8080/${url}`
}

async function post(url: string, data: dynamic) {
    const response = await axios.post(apiUrl(url), data)
    return response.data
}

async function get(url: string) {
    const response = await axios.get(apiUrl(url))
    return response.data
}

export default {
    post,
    get
}