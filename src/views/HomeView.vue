<!-- HomeView.vue -->
<template>
  <div class="py-6">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900">Welcome, {{ authStore.user?.firstName || 'User' }}</h2>
      <p class="mt-1 text-sm text-gray-600">
        {{ greeting }} | Role: {{ authStore.role }}
      </p>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- Orders Card -->
      <div class="bg-white overflow-hidden rounded-lg border border-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-2 bg-purple-50 rounded-lg">
              <ShoppingCartIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ orderCount }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <router-link
                to="/orders"
                class="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              View all orders →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Products Card -->
      <div class="bg-white overflow-hidden rounded-lg border border-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-2 bg-purple-50 rounded-lg">
              <TagIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Products</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ productCount }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <router-link
                to="/products"
                class="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              Manage products →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Clients Card -->
      <div class="bg-white overflow-hidden rounded-lg border border-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-2 bg-purple-50 rounded-lg">
              <UsersIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Clients</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ clientCount }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <router-link
                to="/clients"
                class="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              View clients →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Transactions Card -->
      <div class="bg-white overflow-hidden rounded-lg border border-gray-200">
        <div class="p-5">
          <div class="flex items-center">
            <div class="p-2 bg-purple-50 rounded-lg">
              <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Transactions</p>
              <p class="text-2xl font-semibold text-gray-900">
                {{ transactionCount }}
              </p>
            </div>
          </div>
          <div class="mt-4">
            <router-link
                to="/transactions"
                class="text-sm font-medium text-purple-600 hover:text-purple-800"
            >
              View transactions →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <router-link
            v-for="action in quickActions"
            :key="action.name"
            :to="action.to"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors"
        >
          <component
              :is="action.icon"
              class="h-6 w-6 text-purple-600 mb-2"
          />
          <span class="text-sm font-medium text-gray-900">{{ action.name }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { useProductStore } from '../stores/productStore'
import { useClientStore } from '../stores/clientStore'
import { useTransactionStore } from '../stores/transactionStore'
import {
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PlusIcon,
  ListBulletIcon,
  CreditCardIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const productStore = useProductStore()
const clientStore = useClientStore()
const transactionStore = useTransactionStore()

// Stats count refs
const orderCount = ref(0)
const productCount = ref(0)
const clientCount = ref(0)
const transactionCount = ref(0)

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

// Quick actions menu
const quickActions = computed(() => {
  const actions = [
    { name: 'New Order', to: '/orders', icon: PlusIcon },
    { name: 'View Orders', to: '/orders', icon: ListBulletIcon },
    { name: 'Payments', to: '/payment-methods', icon: CreditCardIcon },
    { name: 'Categories', to: '/categories', icon: DocumentTextIcon },
  ]
  return actions
})

// Fetch initial data
onMounted(async () => {
  try {
    await Promise.all([
      orderStore.fetchOrders(),
      productStore.fetchProducts(),
      clientStore.fetchClients(),
      transactionStore.fetchTransactions()
    ])

    orderCount.value = orderStore.orders.length
    productCount.value = productStore.products.length
    clientCount.value = clientStore.clients.length
    transactionCount.value = transactionStore.transactions.length
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})
</script>