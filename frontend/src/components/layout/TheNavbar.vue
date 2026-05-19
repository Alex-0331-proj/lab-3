<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import logoUrl from '../../assets/logo.png';

const isNavCollapsed = ref(true);
const currentUser = ref(null); 

const closeNavbar = () => {
  isNavCollapsed.value = true;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const checkAuth = async () => {
  const token = getCookie('accessToken');
  if (!token) {
    localStorage.removeItem('currentUser');
    currentUser.value = null;
    return;
  }

  try {
    const response = await fetch('api/auth/me', {
      method: 'GET',
      credentials: 'include' 
    });

    if (response.ok) {
      const data = await response.json();
      
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      currentUser.value = data.user; 
    } else {
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      localStorage.removeItem('currentUser');
      currentUser.value = null;
    }
  } catch (error) {
    console.error("Помилка перевірки авторизації:", error);
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser);
    }
  }
};

const handleLogout = () => {
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem('currentUser');
  
  currentUser.value = null;
  closeNavbar();
  window.location.href = '/';
};

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2">
        <img
          :src="logoUrl"
          alt="ShortyURL"
          width="30"
          height="30"
          class="rounded-circle object-fit-cover"
        />
        ShortyURL
      </RouterLink>

      <button 
        class="navbar-toggler" 
        type="button" 
        @click="isNavCollapsed = !isNavCollapsed"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ 'show': !isNavCollapsed }" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active" @click="closeNavbar">
              Головна
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/profile" class="nav-link" active-class="active" @click="closeNavbar">
              Профіль
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" active-class="active" @click="closeNavbar">
              Про сервіс
            </RouterLink>
          </li>

          <li v-if="!currentUser" class="nav-item ms-lg-3 mt-2 mt-lg-0">
            <RouterLink to="/login" class="btn btn-outline-light btn-sm px-3" @click="closeNavbar">
              Увійти
            </RouterLink>
          </li>

          <li v-else class="nav-item ms-lg-3 mt-2 mt-lg-0 d-flex align-items-center gap-3">
            <span class="text-white fw-semibold">
              <i class="bi bi-person-circle me-1"></i> Привіт, {{ currentUser.name }}!
            </span>
            <button class="btn btn-danger btn-sm px-2 py-1" @click="handleLogout">
              Вийти
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>