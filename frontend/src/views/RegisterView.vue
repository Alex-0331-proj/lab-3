<script setup>
import RegisterCard from '../components/auth/RegisterCard.vue';

const handleRegisterSubmit = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
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