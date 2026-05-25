import axios from 'axios'

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

// attach token to every request
const attachToken = (config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

graphqlInstance.interceptors.request.use(attachToken)
restInstance.interceptors.request.use(attachToken)

// ─── REFRESH TOKEN INTERCEPTOR ────────────────────────────────────────────

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

const handleForceLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
}

const addResponseInterceptor = (instance) => {
    instance.interceptors.response.use(
        // success — pass through unchanged
        (response) => response,

        async (error) => {
            const originalRequest = error.config

            // only handle 401 that haven't been retried yet
            if (error.response?.status !== 401 || originalRequest._retry) {
                return Promise.reject(error)
            }

            // skip refresh for auth endpoints to avoid infinite loops
            const isAuthEndpoint = originalRequest.url?.includes('/auth/refresh') ||
                originalRequest.url?.includes('/auth/login')

            if (isAuthEndpoint) {
                return Promise.reject(error)
            }

            // if already refreshing — queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return instance(originalRequest)
                })
                .catch(err => Promise.reject(err))
            }

            // mark as retried and start refresh
            originalRequest._retry = true
            isRefreshing = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')

                if (!refreshToken) {
                    handleForceLogout()
                    return Promise.reject(error)
                }

                // call refresh endpoint using plain axios
                // not restInstance to avoid interceptor loop
                const res = await axios.post(
                    `${import.meta.env.VITE_REST_URL}/auth/refresh`,
                    { refreshToken }
                )

                const { accessToken } = res.data

                // save new access token
                localStorage.setItem('token', accessToken)

                // update default header
                instance.defaults.headers.Authorization = `Bearer ${accessToken}`

                // resolve all queued requests
                processQueue(null, accessToken)

                // retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return instance(originalRequest)

            } catch (refreshError) {
                processQueue(refreshError, null)
                handleForceLogout()
                return Promise.reject(refreshError)

            } finally {
                isRefreshing = false
            }
        }
    )
}

// apply to both instances
addResponseInterceptor(restInstance)
addResponseInterceptor(graphqlInstance)