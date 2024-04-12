import axios from 'axios'

function buildUrl(url: string) {
    return `http://localhost:8000/${url}`
}

async function post(url: string, data: any) {
    const response = await axios.post(buildUrl(url), data)
    return response.data
}

export default {
    post
}