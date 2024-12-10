<!-- OrdersView.vue -->
<template>
  <div class="py-6">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Orders</h2>
          <p class="mt-1 text-sm text-gray-600">View and manage customer orders</p>
        </div>
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
        >
          <PlusIcon class="h-5 w-5 mr-1.5" />
          New Order
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
        Loading orders...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-4">
      <div class="flex">
        <XCircleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading orders</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Orders table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th class="relative px-6 py-3">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                    'bg-green-100 text-green-800': order.status === 'completed',
                    'bg-yellow-100 text-yellow-800': order.status === 'pending',
                    'bg-blue-100 text-blue-800': order.status === 'processing',
                    'bg-gray-100 text-gray-800': !['completed', 'pending', 'processing'].includes(order.status)
                  }"
                >
                  {{ order.status }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.ID_client }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.ID_Employe }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
              <button
                  @click="editOrder(order)"
                  class="text-purple-600 hover:text-purple-900"
              >
                Edit
              </button>
              <button
                  @click="removeOrder(order.id)"
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
                  {{ editMode ? 'Edit Order' : 'Create New Order' }}
                </DialogTitle>

                <form @submit.prevent="editMode ? updateSelectedOrder() : addOrder()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        v-model="orderForm.status"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Client ID</label>
                    <input
                        v-model.number="orderForm.ID_client"
                        type="number"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                        v-model.number="orderForm.ID_Employe"
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
import { ref, reactive, onMounted } from 'vue'
import { useOrderStore } from '../stores/orderStore'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { PlusIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const store = useOrderStore()
const { orders, loading, error } = store

const showCreateForm = ref(false)
const editMode = ref(false)
const orderForm = reactive({
  status: 'pending',
  ID_client: null,
  ID_Employe: null
})

function closeForm() {
  showCreateForm.value = false
  editMode.value = false
  orderForm.status = 'pending'
  orderForm.ID_client = null
  orderForm.ID_Employe = null
}

function editOrder(order) {
  editMode.value = true
  orderForm.id = order.id
  orderForm.status = order.status
  orderForm.ID_client = order.ID_client
  orderForm.ID_Employe = order.ID_Employe
  showCreateForm.value = true
}

async function addOrder() {
  await store.createOrder({ ...orderForm })
  if (!error) {
    closeForm()
  }
}

async function updateSelectedOrder() {
  await store.updateOrder(orderForm.id, {
    status: orderForm.status,
    ID_client: orderForm.ID_client,
    ID_Employe: orderForm.ID_Employe
  })
  if (!error) {
    closeForm()
  }
}

async function removeOrder(id) {
  if (confirm('Are you sure you want to delete this order?')) {
    await store.deleteOrder(id)
  }
}

onMounted(() => {
  store.fetchOrders()
})
</script>