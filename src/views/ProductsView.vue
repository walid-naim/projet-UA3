<!-- ProductsView.vue -->
<template>
  <div class="py-6">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Products</h2>
          <p class="mt-1 text-sm text-gray-600">Manage your product inventory</p>
        </div>
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
        >
          <PlusIcon class="h-5 w-5 mr-1.5" />
          Add Product
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="inline-flex items-center px-4 py-2 text-purple-700">
        <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-4">
      <div class="flex">
        <XCircleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading products</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Products table -->
    <div v-else class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" class="relative px-6 py-3">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.ID_Categorie }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right space-x-3">
              <button
                  @click="editProduct(product)"
                  class="text-purple-600 hover:text-purple-900"
              >
                Edit
              </button>
              <button
                  v-if="canDelete"
                  @click="removeProduct(product.id)"
                  class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <TransitionRoot appear :show="showCreateForm || editMode" as="template">
      <Dialog as="div" @close="closeForm" class="relative z-10">
        <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
                enter="ease-out duration-300"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {{ editMode ? 'Edit Product' : 'Create New Product' }}
                </DialogTitle>

                <form @submit.prevent="editMode ? updateSelectedProduct() : addProduct()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        v-model="newProduct.name"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        v-model.number="newProduct.price"
                        type="number"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                        v-model.number="newProduct.stock"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Category ID</label>
                    <input
                        v-model.number="newProduct.ID_Categorie"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        @click="closeForm"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        class="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      {{ editMode ? 'Update' : 'Create' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { PlusIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/authStore'

const store = useProductStore()

const authStore = useAuthStore()

const { products, loading, error } = store

const showCreateForm = ref(false)
const editMode = ref(false)
const newProduct = reactive({
  name: '',
  price: 0,
  stock: 0,
  ID_Categorie: null
})

function closeForm() {
  showCreateForm.value = false
  editMode.value = false
  newProduct.name = ''
  newProduct.price = 0
  newProduct.stock = 0
  newProduct.ID_Categorie = null
}

function editProduct(product) {
  editMode.value = true
  newProduct.id = product.id
  newProduct.name = product.name
  newProduct.price = product.price
  newProduct.stock = product.stock
  newProduct.ID_Categorie = product.ID_Categorie
  showCreateForm.value = true
}

const canDelete = computed(() => {
  const role = authStore.role
  return role === 'admin' || role === 'superadmin'
})

async function addProduct() {
  await store.createProduct({ ...newProduct })
  if (!error) {
    closeForm()
  }
}

async function updateSelectedProduct() {
  await store.updateProduct(newProduct.id, {
    name: newProduct.name,
    price: newProduct.price,
    stock: newProduct.stock,
    ID_Categorie: newProduct.ID_Categorie
  })
  if (!error) {
    closeForm()
  }
}

async function removeProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    await store.deleteProduct(id)
  }
}

onMounted(() => {
  store.fetchProducts()
})
</script>