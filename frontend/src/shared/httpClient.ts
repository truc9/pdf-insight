import axios from 'axios'

type dynamic = any

function apiUrl(url: string) {
    return `http://localhost:8000/${url}`
}

async function post(url: string, data: dynamic) {
    const response = await axios.post(apiUrl(url), data)
    return response.data
}

export default {
    post
}