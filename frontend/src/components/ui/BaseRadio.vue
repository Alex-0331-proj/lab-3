<script setup>
defineProps({
  label: String,
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: String,
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label fw-semibold d-block">{{ label }}</label>
    <div 
      v-for="option in options" 
      :key="option.value" 
      class="form-check form-check-inline"
    >
      <input
        class="form-check-input"
        type="radio"
        :name="name"
        :id="`${name}-${option.value}`"
        :value="option.value"
        :checked="modelValue === option.value"
        @change="$emit('update:modelValue', option.value)"
        :required="required"
      />
      <label class="form-check-label" :for="`${name}-${option.value}`">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>