// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { setupInterceptors } from './services/authInterceptor'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ErrorAlert from './components/ErrorAlert.vue'


const app = createApp(App)
app.use(createPinia())
app.use(router)
// Register global components
app.component('LoadingSpinner', LoadingSpinner)
app.component('ErrorAlert', ErrorAlert)

// Setup API interceptors
setupInterceptors()
app.mount('#app')
