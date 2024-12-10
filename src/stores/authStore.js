// stores/authStore.js
import { defineStore } from 'pinia'
import api from '../services/api'  // Make sure this path is correct

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        role: localStorage.getItem('role') || null,
        error: null,
        loading: false
    }),
    actions: {
        async login(email, password) {
            this.loading = true
            this.error = null
            try {
                const { data } = await api.post('/login', { email, password })
                this.user = data.data
                this.token = data.token
                this.role = data.role

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(data.data))
                localStorage.setItem('token', data.token)
                localStorage.setItem('role', data.role)

                // Set API header
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

                return true
            } catch (e) {
                this.error = e.response?.data?.message || e.message
                return false
            } finally {
                this.loading = false
            }
        },
        async logout() {
            try {
                await api.post('/logout')  // If you have a logout endpoint
            } catch (e) {
                console.error('Logout error:', e)
            } finally {
                this.user = null
                this.token = null
                this.role = null
                this.error = null

                localStorage.removeItem('user')
                localStorage.removeItem('token')
                localStorage.removeItem('role')

                api.defaults.headers.common['Authorization'] = ''
            }
        }
    }
})