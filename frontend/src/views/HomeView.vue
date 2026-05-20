<script setup>
import { ref, onMounted } from 'vue';
import TheNavbar from '../components/layout/TheNavbar.vue';
import TheFooter from '../components/layout/TheFooter.vue';
import UrlTable from '../components/main/UrlTable.vue';
import UrlEditModal from '../components/main/UrlEditModal.vue';

const links = ref([]);
const totalCount = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const canAddMore = ref(true);

const longUrl = ref('');
const isEditModalOpen = ref(false);
const selectedLink = ref(null);

const handleDelete = async (id) => {
  if (!confirm('Видалити посилання?')) return;
  const API_BASE = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_BASE}/api/links/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Помилка видалення');
    }

    links.value = links.value.filter(link => link.id !== id);
    if (links.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    fetchLinks();
  } catch (error) {
    console.error('Помилка при видаленні:', error);
    alert(error.message);
  }
};

const fetchLinks = async () => {
  const API_BASE = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_BASE}/api/links?page=${currentPage.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const data = await response.json();
    if (data.data.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      fetchLinks();
      return;
    }

    links.value = data.data;
    totalCount.value = data.totalCount;
    totalPages.value = data.totalPages;
    canAddMore.value = data.canAddMore;
  } catch (error) {
    console.error('Помилка завантаження посилань:', error);
  }
};

const handleShorten = async () => {
  if (!longUrl.value) return;
  const API_BASE = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${API_BASE}/api/links`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ longUrl: longUrl.value })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    longUrl.value = '';
    currentPage.value = 1;
    fetchLinks();
  } catch (error) {
    alert(error.message);
  }
};

const openEditModal = (link) => {
  selectedLink.value = link;
  isEditModalOpen.value = true;
};

const handleSaveEdit = async ({ id, newLongUrl }) => {
  const API_BASE = import.meta.env.VITE_API_URL;

  try {
    await fetch(`${API_BASE}/api/links/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ newLongUrl })
    });
    isEditModalOpen.value = false;
    fetchLinks();
  } catch (error) {
    console.error(error);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  fetchLinks();
};

onMounted(() => {
  fetchLinks();
});
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <TheNavbar />
    
    <main class="container my-5 flex-grow-1">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold">Скоротити посилання</h1>
        <p class="text-muted">Вставте довгий URL та отримайте зручне посилання миттєво</p>
      </div>

      <div class="card p-4 shadow-sm border-0 mb-5">
        <form class="row g-3" @submit.prevent="handleShorten">
          <div class="col-md-9">
            <input
              type="url"
              v-model="longUrl"
              class="form-control form-control-lg"
              :placeholder="canAddMore ? 'https://example.com' : 'Авторизуйтесь, щоб скорочувати більше'"
              :disabled="!canAddMore"
              required
            />
          </div>
          <div class="col-md-3">
            <button
              type="submit"
              class="btn btn-lg w-100 shadow-sm"
              :class="canAddMore ? 'btn-primary' : 'btn-danger'"
              :disabled="!canAddMore"
            >
              {{ canAddMore ? 'Скоротити' : 'Ліміт вичерпано' }}
            </button>
          </div>
        </form>
      </div>
      <UrlTable :links="links" @edit="openEditModal" @delete="handleDelete" />
      <nav v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
        <ul class="pagination shadow-sm">
          <li 
            v-for="page in totalPages" 
            :key="page" 
            class="page-item" 
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
        </ul>
      </nav>
    </main>

    <UrlEditModal 
      :show="isEditModalOpen" 
      :link-data="selectedLink" 
      @close="isEditModalOpen = false" 
      @save="handleSaveEdit" 
    />

    <TheFooter />
  </div>
</template>