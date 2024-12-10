import { defineStore } from 'pinia'
import api from '../services/api'

export const useTransactionStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchTransactions() {
            this.loading = true; this.error = null;
            try {
                const { data } = await api.get('/paymenttransactions');
                this.transactions = data.data;
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },
        async createTransaction(txData) {
            if(!txData.amount || !txData.date || !txData.paymentMethodId) {
                this.error = "amount, date, and paymentMethodId are required."
                return
            }
            try {
                await api.post('/paymenttransactions', txData);
                await this.fetchTransactions();
            } catch (e) {
                this.error = e.message;
            }
        },
        async updateTransaction(id, txData) {
            if(!id) {
                this.error = "No transaction selected for update."
                return
            }
            if(txData.amount == null || !txData.date) {
                this.error = "amount and date are required for update."
                return
            }
            try {
                await api.put(`/paymenttransactions/${id}`, txData);
                await this.fetchTransactions();
            } catch (e) {
                this.error = e.message;
            }
        },
        async deleteTransaction(id) {
            if(!id) {
                this.error = "No transaction selected to delete."
                return
            }
            try {
                await api.delete(`/paymenttransactions/${id}`);
                await this.fetchTransactions();
            } catch (e) {
                this.error = e.message;
            }
        }
    }
})
