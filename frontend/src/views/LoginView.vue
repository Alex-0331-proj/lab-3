<script setup>
import { useRouter } from 'vue-router';
import LoginCard from '../components/auth/LoginCard.vue';

const router = useRouter();

const handleLoginSubmit = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
    alert('Вхід успішний!');
    window.location.href = '/';
  } catch (error) {
    alert(`Помилка входу: ${error.message}`);
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 my-5">
    <LoginCard @login-submit="handleLoginSubmit" />
  </div>
</template>