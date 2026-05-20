<script setup>
import RegisterCard from '../components/auth/RegisterCard.vue';

const API_BASE = import.meta.env.VITE_API_URL;

const handleRegisterSubmit = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    localStorage.setItem('accessToken', data.accessToken);
    
    alert('Реєстрація успішна!');
    window.location.href = '/'; 
  } catch (error) {
    alert(`Помилка: ${error.message}`);
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100 my-5">
    <RegisterCard @register-submit="handleRegisterSubmit" />
  </div>
</template>