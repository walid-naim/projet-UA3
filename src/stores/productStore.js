// frontend/src/stores/productStore.js
import { defineStore } from 'pinia'
import api from '../services/api'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchProducts() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get('/product')
                this.products = data.data
            } catch (e) {
                this.error = e.message
            } finally {
                this.loading = false
            }
        },
        async createProduct(product) {
            if(!product.name || !product.price || product.stock == null || !product.ID_Categorie) {
                this.error = "All product fields are required."
                return
            }
            try {
                await api.post('/product', product)
                await delay(1000)
                await this.fetchProducts()
            } catch (e) {
                this.error = e.response?.data?.error || e.message
            }
        },
        async updateProduct(id, product) {
            if(!id) {
                this.error = "No product selected for update."
                return
            }
            if(!product.name || !product.price || product.stock == null || !product.ID_Categorie) {
                this.error = "All product fields are required."
                return
            }
            try {
                await api.put(`/product/${id}`, product)
                await delay(1000)
                await this.fetchProducts()
            } catch (e) {
                this.error = e.response?.data?.error || e.message
            }
        },
        async deleteProduct(id) {
            if(!id) {
                this.error = "No product selected to delete."
                return
            }
            try {
                await api.delete(`/product/${id}`)
                await delay(1000)
                await this.fetchProducts()
            } catch (e) {
                this.error = e.message
            }
        }
    }
})
