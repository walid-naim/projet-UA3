<!-- App.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="authStore.token">
      <!-- Mobile sidebar backdrop -->
      <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          @click="isMobileMenuOpen = false"
      ></div>

      <!-- Mobile sidebar -->
      <div
          v-show="isMobileMenuOpen"
          class="fixed inset-y-0 left-0 flex w-64 transform transition lg:hidden"
      >
        <div class="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
          <!-- Close button -->
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
                @click="isMobileMenuOpen = false"
                class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
            >
              <XMarkIcon class="h-6 w-6 text-white" />
            </button>
          </div>

          <!-- Sidebar content -->
          <div class="flex flex-col flex-1">
            <div class="flex flex-shrink-0 items-center px-4">
              <span class="text-xl font-bold text-purple-600">MyShop Admin</span>
            </div>
            <nav class="mt-8 flex-1 space-y-1 bg-white px-2">
              <template v-for="section in filteredNavigation" :key="section.name">
                <div class="space-y-1">
                  <h3 class="px-3 text-sm font-medium text-gray-500">{{ section.name }}</h3>
                  <router-link
                      v-for="item in section.items"
                      :key="item.name"
                      :to="item.to"
                      class="group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                      :class="[
                      $route.path === item.to
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <component
                        :is="item.icon"
                        class="mr-3 h-5 w-5 flex-shrink-0"
                        :class="[
                        $route.path === item.to
                          ? 'text-purple-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      ]"
                        aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </div>
              </template>
            </nav>
          </div>
        </div>
      </div>

      <!-- Desktop sidebar -->
      <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <div class="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div class="flex flex-shrink-0 items-center px-4">
              <span class="text-xl font-bold text-purple-600">MyShop Admin</span>
            </div>
            <nav class="mt-8 flex-1 space-y-1 bg-white px-2">
              <template v-for="section in filteredNavigation" :key="section.name">
                <div class="space-y-1">
                  <h3 class="px-3 text-sm font-medium text-gray-500">{{ section.name }}</h3>
                  <router-link
                      v-for="item in section.items"
                      :key="item.name"
                      :to="item.to"
                      class="group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                      :class="[
                      $route.path === item.to
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    ]"
                  >
                    <component
                        :is="item.icon"
                        class="mr-3 h-5 w-5 flex-shrink-0"
                        :class="[
                        $route.path === item.to
                          ? 'text-purple-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      ]"
                        aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </div>
              </template>
            </nav>
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <div class="lg:pl-64 flex flex-col min-h-screen">
        <!-- Mobile header -->
        <div class="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
              @click="isMobileMenuOpen = true"
              class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
        </div>

        <!-- Desktop header -->
        <header class="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div class="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div class="flex flex-1"></div>

            <!-- User menu -->
            <div class="ml-4 flex items-center space-x-4">
              <div class="relative">
                <button
                    @click="isProfileOpen = !isProfileOpen"
                    class="flex items-center space-x-3 rounded-full bg-white text-sm focus:outline-none"
                >
                  <span class="text-gray-700">{{ authStore.user?.firstName || 'User' }}</span>
                  <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                    {{ (authStore.user?.firstName?.[0] || 'U').toUpperCase() }}
                  </span>
                </button>

                <!-- Profile dropdown -->
                <div
                    v-if="isProfileOpen"
                    class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    @click.away="isProfileOpen = false"
                >
                  <div class="px-4 py-2 text-sm text-gray-700">
                    Role: {{ authStore.role }}
                  </div>
                  <div class="border-t border-gray-100"></div>
                  <button
                      @click="handleLogout"
                      class="block w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </template>

    <!-- Non-authenticated layout -->
    <template v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)
const isProfileOpen = ref(false)

const isAdminOrSuperAdmin = computed(() =>
    authStore.role === 'admin' || authStore.role === 'superadmin'
)

// Navigation items
const navigation = computed(() => [
  {
    name: 'Dashboard',
    items: [
      { name: 'Home', icon: HomeIcon, to: '/' }
    ]
  },
  {
    name: 'Products',
    items: [
      { name: 'Products', icon: TagIcon, to: '/products', requiresAdmin: true },
      { name: 'Categories', icon: DocumentTextIcon, to: '/categories', requiresAdmin: true }
    ]
  },
  { 
    name: 'Customers',
    items: [
      { name: 'Clients', icon: UsersIcon, to: '/clients', requiresAdmin: true }
    ]
  },
  {
    name: 'Orders & Payments',
    items: [
      { name: 'Orders', icon: ShoppingCartIcon, to: '/orders' },
      { name: 'Payment Methods', icon: CreditCardIcon, to: '/payment-methods' },
      { name: 'Transactions', icon: CurrencyDollarIcon, to: '/transactions' }
    ]
  }
])

// Filtered navigation based on user role
const filteredNavigation = computed(() =>
    navigation.value.map(section => ({
      ...section,
      items: section.items.filter(item =>
          !item.requiresAdmin || isAdminOrSuperAdmin.value
      )
    })).filter(section => section.items.length > 0)
)

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>