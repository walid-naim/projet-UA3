import { defineStore } from 'pinia'
import api from '../services/api'

export const useOrderStore = defineStore('orders', {
    state: () => ({
        orders: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchOrders() {
            this.loading = true; this.error = null;
            try {
                const { data } = await api.get('/commands');
                this.orders = data;
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },
        async createOrder(orderData) {
            if(!orderData.status || !orderData.ID_client || !orderData.ID_Employe) {
                this.error = "status, ID_client, and ID_Employe are required."
                return
            }
            try {
                await api.post('/commands', orderData);
                await this.fetchOrders();
            } catch (e) {
                this.error = e.message;
            }
        },
        async updateOrder(id, orderData) {
            if(!id) {
                this.error = "No order selected for update."
                return
            }
            if(!orderData.status) {
                this.error = "status is required for update."
                return
            }
            try {
                await api.put(`/commands/${id}`, orderData);
                await this.fetchOrders();
            } catch (e) {
                this.error = e.message;
            }
        },
        async deleteOrder(id) {
            if(!id) {
                this.error = "No order selected to delete."
                return
            }
            try {
                await api.delete(`/commands/${id}`);
                await this.fetchOrders();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
})
