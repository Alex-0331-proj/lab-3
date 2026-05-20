<script setup>
import { RouterLink } from 'vue-router';
import TheNavbar from '../components/layout/TheNavbar.vue';
import TheFooter from '../components/layout/TheFooter.vue';
import logoUrl from '../assets/logo.png';
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <TheNavbar />

    <main class="container my-auto py-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
      <div class="mb-4">
        <img
          :src="logoUrl"
          alt="ShortyURL"
          class="logo-img shadow-lg border border-4 border-white animate-bounce"
        />
      </div>

      <h1 class="display-3 fw-bold text-dark mb-2">ShortyURL</h1>
      <p class="lead text-muted mx-auto mb-5" style="max-width: 700px">
        Ми створили інструмент, який робить інтернет зручнішим. Скорочуйте
        посилання миттєво та діліться ними без зайвих зусиль.
      </p>

      <div class="row g-4 mt-2 max-width-cards mx-auto">
        <div class="col-md-4">
          <div class="card p-4 border-0 shadow-sm h-100 feature-card">
            <h4 class="fw-bold text-primary mb-3">⚡ Швидкість</h4>
            <p class="mb-0 text-muted small">
              Миттєва генерація короткого коду без жодного очікування.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 border-0 shadow-sm h-100 feature-card">
            <h4 class="fw-bold text-primary mb-3">📊 Статистика</h4>
            <p class="mb-0 text-muted small">
              Доступ до детальної кількості переходів за посиланнями у реальному часі.
            </p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 border-0 shadow-sm h-100 feature-card">
            <h4 class="fw-bold text-primary mb-3">🔒 Безпека</h4>
            <p class="mb-0 text-muted small">
              Усі ваші дані надійно захищені сучасними криптографічними протоколами.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <RouterLink
          to="/"
          class="btn btn-primary btn-lg px-5 shadow-sm rounded-pill start-btn"
        >
          Спробувати зараз
        </RouterLink>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.logo-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 25px;
}

.max-width-cards {
  max-width: 900px;
}

.feature-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
}

.start-btn {
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: scale(1.05);
}
</style>