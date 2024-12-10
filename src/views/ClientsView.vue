<!-- ClientsView.vue -->
<template>
  <div class="py-6">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">Clients</h2>
          <p class="mt-1 text-sm text-gray-600">Manage your client database</p>
        </div>
        <button
            @click="showCreateForm = true"
            class="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
        >
          <PlusIcon class="h-5 w-5 mr-1.5" />
          Add Client
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
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-purple-600">
                      {{ client.firstName[0] }}{{ client.lastName[0] }}
                    </span>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ client.firstName }} {{ client.lastName }}
                </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.phone || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ client.address || '-' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
                @click="editClient(client)"
                class="text-purple-600 hover:text-purple-900 mr-3"
            >
              Edit
            </button>
            <button
                @click="removeClient(client.id)"
                class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <TransitionRoot appear :show="showCreateForm" as="template">
      <Dialog as="div" @close="closeForm" class="relative z-10">
        <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                {{ editMode ? 'Edit Client' : 'Add New Client' }}
              </DialogTitle>

              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                      v-model="clientForm.firstName"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                      v-model="clientForm.lastName"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input
                      v-model="clientForm.email"
                      type="email"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                      v-model="clientForm.phone"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Address</label>
                  <input
                      v-model="clientForm.address"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>

                <div v-if="!editMode">
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input
                      v-model="clientForm.password"
                      type="password"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>


                <div class="mt-6 flex justify-end space-x-3">
                  <button
                      type="button"
                      class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      @click="closeForm"
                  >
                    Cancel
                  </button>
                  <button
                      type="submit"
                      class="rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    {{ editMode ? 'Update' : 'Create' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useClientStore } from '../stores/clientStore'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { PlusIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const store = useClientStore()
const { clients, loading, error } = store

const showCreateForm = ref(false)
const editMode = ref(false)
const clientForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  address: ''
})

function closeForm() {
  showCreateForm.value = false
  editMode.value = false
  Object.keys(clientForm).forEach(key => clientForm[key] = '')
}

function editClient(client) {
  editMode.value = true
  showCreateForm.value = true
  Object.keys(clientForm).forEach(key => {
    if (key !== 'password') {
      clientForm[key] = client[key]
    }
  })
  clientForm.id = client.id
}

async function handleSubmit() {
  try {
    let success;

    if (editMode.value) {
      const { id, ...updateData } = clientForm;
      success = await store.updateClient(id, updateData);
    } else {
      success = await store.createClient({ ...clientForm });
    }

    if (success) {
      closeForm();
    }
  } catch (e) {
    console.error('Form submission error:', e);
  }
}

function removeClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    store.deleteClient(id)
  }
}

onMounted(() => {
  store.fetchClients()
})
</script>