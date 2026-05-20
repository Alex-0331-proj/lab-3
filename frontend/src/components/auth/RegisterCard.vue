<script setup>
import { ref } from 'vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseRadio from '../ui/BaseRadio.vue';
import logoUrl from '../../assets/logo.png';

const emit = defineEmits(['register-submit', 'switch-page']);

const formData = ref({
  name: '',
  email: '',
  password: '',
  sex: '',
  dob: ''
});

const genderOptions = [
  { label: 'Чоловіча', value: 'Чоловіча' },
  { label: 'Жіноча', value: 'Жіноча' }
];

const submitForm = () => {
  emit('register-submit', { ...formData.value });
};

const openDatePicker = (event) => {
  const input = event.currentTarget.querySelector('input[type="date"]');
  if (input && typeof input.showPicker === 'function') {
    input.showPicker();
  }
};
</script>

<template>
  <div class="card p-4 shadow border-0" style="width: 100%; max-width: 450px">
    <div class="d-flex flex-column align-items-center text-center mb-4">
      <div class="d-flex align-items-center">
        <img 
          :src="logoUrl" 
          alt="ShortyURL" 
          width="32" 
          height="32" 
          class="rounded-circle object-fit-cover" 
        />
        <h2 class="fw-bold ms-2 mb-0">ShortyURL</h2>
      </div>
      <p class="text-muted">Створіть свій безкоштовний акаунт</p>
    </div>
    
    <form @submit.prevent="submitForm">
      <BaseInput 
        label="Ім'я" 
        v-model="formData.name" 
        required 
      />

      <BaseInput 
        label="Email" 
        type="email" 
        v-model="formData.email" 
        required 
      />

      <BaseInput 
        label="Пароль" 
        type="password" 
        v-model="formData.password" 
        required 
      />

      <BaseRadio 
        label="Стать"
        name="sex"
        :options="genderOptions"
        v-model="formData.sex"
        required
      />

      <div class="datepicker-wrapper" style="cursor: pointer" @click="openDatePicker">
        <BaseInput 
          label="Дата народження" 
          type="date" 
          v-model="formData.dob" 
          required 
        />
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2 shadow-sm mt-2">
        Зареєструватися
      </button>

      <div class="text-center mt-3">
        <small>
          Вже маєте акаунт?
          <RouterLink to="/login" class="text-decoration-none fw-semibold text-primary">
                Увійти
          </RouterLink>
        </small>
      </div>
    </form>
  </div>
</template>

<style scoped>
.datepicker-wrapper :deep(.form-control) {
  cursor: pointer;
}
</style>