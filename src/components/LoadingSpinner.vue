<!-- components/LoadingSpinner.vue -->
<template>
  <div :class="['loading-overlay', fullScreen ? 'fixed inset-0' : 'absolute inset-0']" v-if="show">
    <div class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="mt-2 text-sm text-gray-500" v-if="message">{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loading-overlay {
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 50;
}
</style>