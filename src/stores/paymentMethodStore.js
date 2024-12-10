import { defineStore } from 'pinia'
import api from '../services/api'

export const usePaymentMethodStore = defineStore('paymentMethods', {
    state: () => ({
        paymentMethods: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchPaymentMethods() {
            this.loading = true; this.error = null;
            try {
                const { data } = await api.get('/paymentmethods');
                this.paymentMethods = data.data;
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },
        async createPaymentMethod(pmData) {
            if(!pmData.type || !pmData.ID_commande) {
                this.error = "type and ID_commande are required."
                return
            }
            try {
                await api.post('/paymentmethods', pmData);
                await this.fetchPaymentMethods();
            } catch (e) {
                this.error = e.message;
            }
        },
        async updatePaymentMethod(id, pmData) {
            if(!id) {
                this.error = "No payment method selected for update."
                return
            }
            if(!pmData.type) {
                this.error = "type is required for update."
                return
            }
            try {
                await api.put(`/paymentmethods/${id}`, pmData);
                await this.fetchPaymentMethods();
            } catch (e) {
                this.error = e.message;
            }
        },
        async deletePaymentMethod(id) {
            if(!id) {
                this.error = "No payment method selected to delete."
                return
            }
            try {
                await api.delete(`/paymentmethods/${id}`);
                await this.fetchPaymentMethods();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
})
