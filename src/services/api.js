// services/api.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/lol',  
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

export default api