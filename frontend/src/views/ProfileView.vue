<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheNavbar from '../components/layout/TheNavbar.vue';
import TheFooter from '../components/layout/TheFooter.vue';

const router = useRouter();
const user = ref(null);

onMounted(() => {
  const savedUser = localStorage.getItem('currentUser');
  if (!savedUser) {
    router.push('/login');
    return;
  }
  user.value = JSON.parse(savedUser);
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <TheNavbar />

    <main class="container my-5 flex-grow-1">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow border-0 overflow-hidden">
            <div class="card-header bg-primary text-white py-3 text-center">
              <h5 class="mb-0 fw-bold">Особисті дані користувача</h5>
            </div>
            
            <div class="card-body p-0">
              <table v-if="user" class="table table-striped mb-0 align-middle">
                <tbody>
                  <tr>
                    <th class="ps-4 w-25 py-3">Ім'я</th>
                    <td class="py-3 text-secondary">{{ user.name }}</td>
                  </tr>
                  <tr>
                    <th class="ps-4 py-3">Email</th>
                    <td class="py-3 fw-semibold text-primary">{{ user.email }}</td>
                  </tr>
                  <tr>
                    <th class="ps-4 py-3">Стать</th>
                    <td class="py-3 text-secondary">{{ user.sex || 'Не вказано' }}</td>
                  </tr>
                  <tr>
                    <th class="ps-4 py-3">Дата народження</th>
                    <td class="py-3 text-secondary">{{ user.dob || 'Не вказано' }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="text-center py-5 text-muted">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                Завантаження профілю...
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
  th {
    font-weight: 600;
    color: #495057;
  }
</style>