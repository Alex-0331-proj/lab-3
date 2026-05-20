<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0 fw-bold">Ваші посилання</h3>
      <span class="badge bg-secondary px-3 py-2 rounded-pill">
        Всього: {{ links.length }}
      </span>
    </div>

    <div class="table-responsive card shadow-sm border-0">
      <table class="table table-hover mb-0 align-middle">
        <thead class="table-light">
          <tr>
            <th>Оригінальний URL</th>
            <th>Скорочений URL</th>
            <th class="text-end">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in links" :key="link.id">
            <td class="text-truncate" style="max-width: 250px">
              <a :href="link.long" target="_blank" class="text-decoration-none text-muted" :title="link.long">
                {{ link.long }}
              </a>
            </td>
            <td>
              <a :href="link.long" target="_blank" class="text-decoration-none fw-bold text-primary">
                {{ link.short }}
              </a>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-warning border-0" @click="$emit('edit', link)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger border-0" @click="$emit('delete', link.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="links.length === 0">
            <td colspan="3" class="text-center text-muted py-4">Список поки що порожній</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  links: {
    type: Array,
    required: true,
    default: () => []
  }
});

defineEmits(['edit', 'delete']);
</script>