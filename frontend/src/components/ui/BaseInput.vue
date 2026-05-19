<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number],
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
const isPasswordVisible = ref(false);
const currentType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return props.type;
});
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label fw-semibold">{{ label }}</label>
    
    <div :class="{ 'input-group': type === 'password' }">
      <input
        :type="currentType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control"
        v-bind="$attrs"
        :required="required"
      />
      
      <button
        v-if="type === 'password'"
        class="btn btn-outline-secondary"
        type="button"
        @click="isPasswordVisible = !isPasswordVisible"
        title="Показати/приховати пароль"
      >
        <i :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
  .input-group .btn {
    z-index: 4;
  }
</style>