<!-- components/BaseButton.vue -->
<template>
  <button
      :type="type"
      :class="[
      'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
      sizeClasses[size],
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
      :disabled="disabled || loading"
      @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
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

    <!-- Icon (if provided) -->
    <component
        v-if="icon && !loading"
        :is="icon"
        class="h-4 w-4"
        :class="{ 'mr-2': $slots.default }"
    />

    <!-- Button Content -->
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary',
      'secondary',
      'danger',
      'success',
      'warning',
      'text'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: [Object, Function],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

// Size classes mapping
const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

// Variant classes mapping using Claude.ai colors
const variantClasses = {
  primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 border border-transparent',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-purple-500 border border-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 border border-transparent',
  text: 'bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
}

defineEmits(['click'])
</script>