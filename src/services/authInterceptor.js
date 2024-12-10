// services/authInterceptor.js
import api from './api'
import { useAuthStore } from '../stores/authStore'
import router from '../router'

export function setupInterceptors() {
    // Request interceptor
    api.interceptors.request.use(
        (config) => {
            const authStore = useAuthStore()
            if (authStore.token) {
                config.headers.Authorization = `Bearer ${authStore.token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Response interceptor
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const authStore = useAuthStore()

            if (error.response) {
                // Handle 401 Unauthorized
                if (error.response.status === 401) {
                    authStore.logout()
                    router.push('/login')
                    return Promise.reject(new Error('Session expired. Please login again.'))
                }

                // Handle 403 Forbidden
                if (error.response.status === 403) {
                    router.push('/')
                    return Promise.reject(new Error('You do not have permission to perform this action.'))
                }

                // Handle 404 Not Found
                if (error.response.status === 404) {
                    return Promise.reject(new Error('The requested resource was not found.'))
                }

                // Handle 422 Validation Error
                if (error.response.status === 422) {
                    return Promise.reject(new Error(error.response.data.message || 'Validation failed.'))
                }

                // Handle 500 Server Error
                if (error.response.status >= 500) {
                    return Promise.reject(new Error('An server error occurred. Please try again later.'))
                }
            }

            return Promise.reject(error)
        }
    )
}