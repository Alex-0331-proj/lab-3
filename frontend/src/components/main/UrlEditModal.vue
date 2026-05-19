<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0, 0, 0, 0.5);"
      @click.self="handleClose"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Редагувати посилання</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="handleClose" 
              aria-label="Close"
            ></button>
          </div>
          
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Оригінальний URL</label>
              <input
                type="url"
                v-model="localUrl"
                class="form-control"
                placeholder="https://example.com"
                required
                @keyup.enter="handleSave"
              />
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="handleClose"
            >
              Скасувати
            </button>
            <button 
              type="button" 
              class="btn btn-primary px-4 shadow-sm" 
              :disabled="!localUrl.trim()"
              @click="handleSave"
            >
              Зберегти зміни
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  linkData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

const localUrl = ref('');

watch(() => props.linkData, (newVal) => {
  if (newVal) {
    localUrl.value = newVal.long;
  } else {
    localUrl.value = '';
  }
}, { immediate: true });

const handleClose = () => {
  emit('close');
};

const handleSave = () => {
  if (!localUrl.value.trim()) return;
  emit('save', {
    id: props.linkData.id,
    newLongUrl: localUrl.value.trim()
  });
};
</script>