<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import BaseInput from '../ui/BaseInput.vue';
import logoUrl from '../../assets/logo.png';

const emit = defineEmits(['login-submit']);

const email = ref('');
const password = ref('');

const submitForm = () => {
  emit('login-submit', { email: email.value, password: password.value });
};
</script>

<template>
  <div class="card p-4 shadow border-0" style="width: 100%; max-width: 400px">
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
      <p class="text-muted mt-2 mb-0">Ласкаво просимо!</p>
    </div>
    
    <form @submit.prevent="submitForm">
      <BaseInput 
        label="Email" 
        type="email" 
        v-model="email" 
        required 
      />

      <BaseInput 
        label="Пароль" 
        type="password" 
        v-model="password" 
        required 
      />

      <button type="submit" class="btn btn-success w-100 py-2 shadow-sm mt-2">
        Увійти
      </button>

      <div class="text-center mt-3">
        <RouterLink to="/register" class="small text-decoration-none text-muted">
          Створити новий акаунт
        </RouterLink>
      </div>
    </form>
  </div>
</template>