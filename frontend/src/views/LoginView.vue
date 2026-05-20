<script setup>
import LoginCard from '../components/auth/LoginCard.vue';

const handleLoginSubmit = async (credentials) => {
  const API_BASE = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    localStorage.setItem('accessToken', data.accessToken);
    
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