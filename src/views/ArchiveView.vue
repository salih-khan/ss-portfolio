<template>
  <div class="archive-page">
    <!-- Minimalist Archive Header -->
    <div class="archive-header">
      <h1 class="archive-title">Archive</h1>
      <p class="archive-description">Browse our photography collections</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading archive...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>Error loading archive: {{ error.message }}</p>
    </div>

    <div v-else class="categories-grid">
      <router-link
        v-for="category in categories"
        :key="category.name"
        :to="{ name: 'Category', params: { category: category.name } }"
        class="category-link"
      >
        {{ category.displayName }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useArchiveNavigation } from '@/composables/useArchiveNavigation'

const { getCategories, loading, error } = useArchiveNavigation()
const categories = ref([])

onMounted(async () => {
  categories.value = await getCategories()
})
</script>

<style scoped>
.archive-page {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  min-height: 100vh;
}

.archive-header {
  text-align: center;
  margin-bottom: 5rem;
}

.archive-title {
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: 2px;
  color: #222;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.archive-description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
}

.categories-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.category-link {
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #666;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
}

.category-link:hover {
  color: #000;
  background: #f5f5f5;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.loader {
  width: 50px;
  height: 50px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 4rem;
  color: #ff4444;
}

@media (max-width: 768px) {
  .archive-page {
    padding: 2rem 1rem;
  }

  .archive-title {
    font-size: 1.5rem;
    letter-spacing: 3px;
  }

  .category-link {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }
}
</style>
