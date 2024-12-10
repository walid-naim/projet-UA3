// stores/clientStore.js
import { defineStore } from 'pinia'
import api from '../services/api'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export const useClientStore = defineStore('clients', {
    state: () => ({
        clients: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchClients() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get('/clients');
                this.clients = data;
            } catch (e) {
                this.error = e.response?.data?.message || e.message;
            } finally {
                this.loading = false;
            }
        },
        async createClient(clientData) {
            this.loading = true;
            this.error = null;

            if(!clientData.firstName || !clientData.lastName || !clientData.email || !clientData.password) {
                this.error = "All required fields must be filled.";
                this.loading = false;
                return false;
            }

            try {
                await api.post('/clients', clientData);
                await delay(1000);
                await this.fetchClients();
                return true;
            } catch (e) {
                this.error = e.response?.data?.message || e.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
        async updateClient(id, clientData) {
            this.loading = true;
            this.error = null;

            if(!id) {
                this.error = "No client selected for update.";
                this.loading = false;
                return false;
            }

            try {
                await api.put(`/clients/${id}`, clientData);
                await delay(1000);
                await this.fetchClients();
                return true;
            } catch (e) {
                this.error = e.response?.data?.message || e.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
        async deleteClient(id) {
            this.loading = true;
            this.error = null;

            if(!id) {
                this.error = "No client selected to delete.";
                this.loading = false;
                return false;
            }

            try {
                await api.delete(`/clients/${id}`);
                await delay(1000);
                await this.fetchClients();
                return true;
            } catch (e) {
                this.error = e.response?.data?.message || e.message;
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
})