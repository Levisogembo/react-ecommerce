import axios from "axios";


// graphql instance
export const graphqlInstance = axios.create({
    baseURL: import.meta.env.VITE_GRAPHQL_URL,
    withCredentials: true,
})

// rest instance 
export const restInstance = axios.create({
    baseURL: import.meta.env.VITE_REST_URL,
    withCredentials: true,
})

// attach token interceptor to both
const attachToken = (config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

graphqlInstance.interceptors.request.use(attachToken)
restInstance.interceptors.request.use(attachToken)