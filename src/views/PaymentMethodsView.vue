<!-- PaymentMethodsView.vue -->
<template>
  <div class="py-6">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Payment Methods</h2>
          <p class="mt-1 text-sm text-gray-600">Manage available payment methods</p>
        </div>
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
        >
          <PlusIcon class="h-5 w-5 mr-1.5" />
          Add Method
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
        Loading payment methods...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-4">
      <div class="flex">
        <XCircleIcon class="h-5 w-5 text-red-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading payment methods</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Payment Methods Cards -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
          v-for="method in paymentMethods"
          :key="method.id"
          class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="w-full">
              <h3 class="text-lg font-medium text-gray-900">
                {{ method.type }}
              </h3>
              <p class="mt-1 text-sm text-gray-600">
                {{ method.description || 'No description available' }}
              </p>
              <p class="mt-2 text-sm text-gray-500">
                Order ID: {{ method.ID_commande }}
              </p>
            </div>
          </div>
          <div class="mt-4 border-t border-gray-200 pt-4 flex justify-end space-x-3">
            <button
                @click="editMethod(method)"
                class="text-purple-600 hover:text-purple-900 text-sm font-medium"
            >
              Edit
            </button>
            <button
                @click="removeMethod(method.id)"
                class="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
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
                  {{ editMode ? 'Edit Payment Method' : 'Add Payment Method' }}
                </DialogTitle>

                <form @submit.prevent="editMode ? updateSelectedMethod() : addMethod()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <input
                        v-model="pmForm.type"
                        type="text"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        v-model="pmForm.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Order ID</label>
                    <input
                        v-model.number="pmForm.ID_commande"
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
import { usePaymentMethodStore } from '../stores/paymentMethodStore'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { PlusIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const store = usePaymentMethodStore()
const { paymentMethods, loading, error } = store

const showCreateForm = ref(false)
const editMode = ref(false)
const pmForm = reactive({
  type: '',
  description: '',
  ID_commande: null
})

function closeForm() {
  showCreateForm.value = false
  editMode.value = false
  pmForm.type = ''
  pmForm.description = ''
  pmForm.ID_commande = null
}

function editMethod(method) {
  editMode.value = true
  pmForm.id = method.id
  pmForm.type = method.type
  pmForm.description = method.description || ''
  pmForm.ID_commande = method.ID_commande
  showCreateForm.value = true
}

async function addMethod() {
  await store.createPaymentMethod({ ...pmForm })
  if (!error) {
    closeForm()
  }
}

async function updateSelectedMethod() {
  await store.updatePaymentMethod(pmForm.id, {
    type: pmForm.type,
    description: pmForm.description,
    ID_commande: pmForm.ID_commande
  })
  if (!error) {
    closeForm()
  }
}

async function removeMethod(id) {
  if (confirm('Are you sure you want to delete this payment method?')) {
    await store.deletePaymentMethod(id)
  }
}

onMounted(() => {
  store.fetchPaymentMethods()
})
</script>