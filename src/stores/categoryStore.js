// src/stores/categoryStore.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        categories: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchCategories() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get('/categories');
                this.categories = data;
            } catch (e) {
                this.error = e.message;
            } finally {
                this.loading = false;
            }
        },
        async createCategory(name) {
            if (!name) {
                this.error = "Category name is required.";
                return;
            }
            try {
                await api.post('/categories', { name });
                await this.fetchCategories();
            } catch (e) {
                this.error = e.response?.data?.error || e.message;
            }
        },
        async deleteCategory(id) {
            if(!id) {
                this.error = "No category selected to delete."
                return
            }
            try {
                await api.delete(`/categories/${id}`)
                this.categories = this.categories.filter(c => c.id !== id)
            } catch (e) {
                this.error = e.message
            }
        }
    }
})
