<!-- components/BaseTable.vue -->
<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
    <!-- Table Header with Actions -->
    <div class="bg-white px-4 py-5 sm:px-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
          <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <div v-if="showSearch" class="relative">
            <input
                v-model="searchQuery"
                type="text"
                class="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                placeholder="Search..."
                @input="handleSearch"
            />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
          <tr>
            <th
                v-for="column in columns"
                :key="column.key"
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                :class="column.headerClass"
            >
              {{ column.label }}
            </th>
            <th v-if="hasActions" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <template v-if="filteredItems.length">
            <tr v-for="item in filteredItems" :key="item.id">
              <td
                  v-for="column in columns"
                  :key="column.key"
                  class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                  :class="column.cellClass"
              >
                <component
                    v-if="column.component"
                    :is="column.component"
                    :value="item[column.key]"
                    :item="item"
                />
                <template v-else>
                  {{ formatValue(item[column.key], column.format) }}
                </template>
              </td>
              <td v-if="hasActions" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                <slot name="row-actions" :item="item">
                  <button
                      @click="$emit('edit', item)"
                      class="text-purple-600 hover:text-purple-900"
                  >
                    Edit<span class="sr-only">, {{ item.id }}</span>
                  </button>
                  <button
                      @click="$emit('delete', item)"
                      class="ml-3 text-red-600 hover:text-red-900"
                  >
                    Delete<span class="sr-only">, {{ item.id }}</span>
                  </button>
                </slot>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td
                :colspan="columns.length + (hasActions ? 1 : 0)"
                class="py-4 text-center text-sm text-gray-500"
            >
              <div v-if="loading" class="flex items-center justify-center space-x-2">
                <svg
                    class="h-5 w-5 animate-spin text-purple-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
              </div>
              <div v-else>
                <slot name="empty">No items found.</slot>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && !loading" class="bg-white px-4 py-3 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ endIndex }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
              :disabled="currentPage === totalPages"
              @click="handlePageChange(currentPage + 1)"
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['edit', 'delete', 'page-change', 'search'])

const searchQuery = ref('')
const currentPage = ref(1)

const hasActions = computed(() => {
  return !!useSlots().['row-actions']
})

const filteredItems = computed(() => {
  let filtered = props.items

  if (searchQuery.value) {
    filtered = filtered.filter(item => {
      return props.columns.some(column => {
        const value = item[column.key]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      })
    })
  }

  if (!props.showPagination) return filtered

  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filtered.slice(start, end)
})

const totalItems = computed(() => filteredItems.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / props.itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * props.itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + props.itemsPerPage, totalItems.value))

function formatValue(value, format) {
  if (!format || value == null) return value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    case 'date':
      return new Date(value).toLocaleDateString()
    case 'number':
      return new Intl.NumberFormat().format(value)
    default:
      return value
  }
}

function handlePageChange(page) {
  currentPage.value = page
  emit('page-change', page)
}

function handleSearch(event) {
  currentPage.value = 1
  emit('search', event.target.value)
}
</script>