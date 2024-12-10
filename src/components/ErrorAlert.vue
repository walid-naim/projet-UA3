<!-- components/ErrorAlert.vue -->
<template>
  <TransitionRoot as="template" :show="show">
    <div
        class="fixed inset-x-0 top-4 flex items-center justify-center px-4 z-50"
        v-if="show"
    >
      <div class="rounded-md bg-red-50 p-4 shadow-lg max-w-md w-full">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ title }}
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ message }}
            </div>
          </div>
          <div class="ml-auto pl-3">
            <div class="-mx-1.5 -my-1.5">
              <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <span class="sr-only">Dismiss</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
import { TransitionRoot } from '@headlessui/vue'
import { XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Error'
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>