<template>
  <div class="archive-page">
    <!-- Header -->
    <div class="archive-header">
      <h1 class="archive-title">Archive // Elements</h1>
      <p class="archive-description">This ledger tracks the evolving visual timeline of Surma Studio. It is cataloged strictly into three sectors — wedding, editorial and product — allowing the work to be viewed as a continuous, uninterrupted exploration of the visual flow.</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading archive...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>Error loading archive: {{ error.message }}</p>
    </div>

    <div v-else class="categories-grid">
      <div class="categories-wrapper">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="{ name: 'Category', params: { categoryId: category.id } }"
          class="category-link"
        >
          <span class="category-number">{{ category.order.toString().padStart(2, '0') }}</span>
          <span class="category-name">{{ category.displayName }}</span>
        </router-link>
      </div>
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
  console.log('📊 Categories loaded:', categories.value)
})
</script>

<style scoped>
.archive-page {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 2rem;
  min-height: 100vh;
}

.archive-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.archive-title {
  font-family: 'Helvetica Now', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #222;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.archive-description {
  font-family: 'Helvetica Now', sans-serif;
  color: #777;
  margin: 0 auto;
  font-size: 0.85rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 600px;
  letter-spacing: 0.3px;
}

.categories-grid {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.categories-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: auto;
  min-width: 300px;
}

.category-link {
  display: flex;
  align-items: baseline;
  gap: 2rem;
  font-size: 6rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #666;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  padding: 0.25rem 1.5rem;
  width: 100%;
}

.category-link:hover {
  color: #000;
  background: #f5f5f5;
}

.category-number {
  font-size: 1.4rem;
  font-weight: 500;
  color: #bbb;
  letter-spacing: 2px;
  min-width: 60px;
  text-align: right;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.category-link:hover .category-number {
  color: #888;
}

.category-name {
  font-size: 6rem;
  font-weight: 400;
  letter-spacing: 2px;
  text-align: left;
  line-height: 1.1;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 4rem;
  color: #ff4444;
}

@media (max-width: 1024px) {
  .category-link {
    font-size: 4rem;
    gap: 1.5rem;
  }
  .category-name {
    font-size: 4rem;
  }
  .category-number {
    font-size: 1.2rem;
    min-width: 50px;
  }
}

@media (max-width: 768px) {
  .archive-page {
    padding: 1rem;
  }
  .archive-title {
    font-size: 1.5rem;
  }
  .archive-description {
    font-size: 0.8rem;
    max-width: 100%;
  }
  .categories-wrapper {
    min-width: 200px;
    width: 100%;
  }
  .category-link {
    font-size: 2.5rem;
    gap: 1rem;
    padding: 0.2rem 1rem;
  }
  .category-name {
    font-size: 2.5rem;
  }
  .category-number {
    font-size: 0.9rem;
    min-width: 36px;
    text-align: right;
  }
}

@media (max-width: 480px) {
  .category-link {
    font-size: 1.8rem;
    gap: 0.75rem;
  }
  .category-name {
    font-size: 1.8rem;
  }
  .category-number {
    font-size: 0.75rem;
    min-width: 30px;
  }
  .categories-wrapper {
    min-width: 160px;
  }
}
</style>
