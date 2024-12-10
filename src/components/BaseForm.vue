<!-- components/BaseForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Form Header -->
    <div v-if="title || description" class="mb-6">
      <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    </div>

    <!-- Form Fields -->
    <div class="grid gap-4" :class="gridCols">
      <div v-for="field in fields" :key="field.name" :class="field.colSpan">
        <!-- Field Label -->
        <label :for="field.name" class="block text-sm font-medium text-gray-700 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- Text, Email, Password, Number Inputs -->
        <input
            v-if="['text', 'email', 'password', 'number'].includes(field.type)"
            :id="field.name"
            :type="field.type"
            :value="modelValue[field.name]"
            @input="updateField(field.name, $event.target.value)"
            :required="field.required"
            :placeholder="field.placeholder"
            :min="field.min"
            :max="field.max"
            :class="[
            'w-full rounded-md shadow-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm',
            { 'border-red-300': errors[field.name] }
          ]"
        />

        <!-- Select Input -->
        <select
            v-else-if="field.type === 'select'"
            :id="field.name"
            :value="modelValue[field.name]"
            @change="updateField(field.name, $event.target.value)"
            :required="field.required"
            :class="[
            'w-full rounded-md shadow-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm',
            { 'border-red-300': errors[field.name] }
          ]"
        >
          <option value="" disabled selected>{{ field.placeholder || 'Select...' }}</option>
          <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Textarea -->
        <textarea
            v-else-if="field.type === 'textarea'"
            :id="field.name"
            :value="modelValue[field.name]"
            @input="updateField(field.name, $event.target.value)"
            :required="field.required"
            :placeholder="field.placeholder"
            :rows="field.rows || 3"
            :class="[
            'w-full rounded-md shadow-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500 sm:text-sm',
            { 'border-red-300': errors[field.name] }
          ]"
        ></textarea>

        <!-- Error Message -->
        <p v-if="errors[field.name]" class="mt-1 text-sm text-red-600">
          {{ errors[field.name] }}
        </p>

        <!-- Help Text -->
        <p v-if="field.helpText" class="mt-1 text-sm text-gray-500">
          {{ field.helpText }}
        </p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
      <button
          v-if="showCancel"
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        {{ cancelText }}
      </button>
      <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        <svg
            v-if="loading"
            class="w-4 h-4 mr-2 animate-spin"
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
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  submitText: {
    type: String,
    default: 'Save'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  columns: {
    type: Number,
    default: 1,
    validator: (value) => [1, 2, 3].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Compute grid columns class based on columns prop
const gridCols = computed(() => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
  return cols[props.columns]
})

// Update field value and emit changes
function updateField(fieldName, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [fieldName]: value
  })
}

// Handle form submission
function handleSubmit() {
  emit('submit', props.modelValue)
}
</script>