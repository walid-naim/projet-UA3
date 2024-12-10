import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import ClientsView from '../views/ClientsView.vue'
import OrdersView from '../views/OrdersView.vue'
import PaymentMethodsView from '../views/PaymentMethodsView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
    { path: '/login', name: 'Login', component: LoginView, meta: { requiresAuth: false } },
    { path: '/register', name: 'Register', component: RegisterView, meta: { requiresAuth: false } },
    { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/products', name: 'Products', component: ProductsView, meta: { requiresAuth: true, requiredRole: 'admin' }},
    { path: '/categories', name: 'Categories', component: CategoriesView, meta: { requiresAuth: true, requiredRole: 'admin' }},
    { path: '/clients', name: 'Clients', component: ClientsView, meta: { requiresAuth: true, requiredRole: 'admin' }},
    { path: '/orders', name: 'Orders', component: OrdersView, meta: { requiresAuth: true } },
    { path: '/payment-methods', name: 'PaymentMethods', component: PaymentMethodsView, meta: { requiresAuth: true, requiredRole: 'admin' }},
    { path: '/transactions', name: 'Transactions', component: TransactionsView, meta: { requiresAuth: true, requiredRole: 'admin' }},
    { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to,from,next)=>{
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth
    const requiredRole = to.meta.requiredRole

    if (requiresAuth && !authStore.token) {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    if ((to.name === 'Login' || to.name === 'Register') && authStore.token) {
        return next({ name:'Home' })
    }

    if (requiredRole && authStore.role) {
        const hasRequiredRole = authStore.role === 'admin' || authStore.role === 'superadmin'
        if (!hasRequiredRole) {
            return next({ name: 'Home' })
        }
    }

    next()
})

export default router
