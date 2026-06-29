<template>
  <div class="category-page">
    <div class="archive-header">
      <h1 class="archive-title">Archive // Elements</h1>
      <p class="archive-description">This ledger tracks the evolving visual timeline of Surma Studio. It is cataloged strictly into three sectors — wedding, editorial and product — allowing the work to be viewed as a continuous, uninterrupted exploration of the visual flow.</p>
    </div>

    <div class="breadcrumb">
      <router-link to="/archive">Archive</router-link>
      <span>/</span>
      <span class="current">{{ category?.displayName || '' }}</span>
    </div>

    <!-- Show placeholder if available AND no collections -->
    <div v-if="!loading && collections.length === 0 && category?.placeholder" class="placeholder-text">
      {{ category.placeholder }}
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading collections...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadData" class="retry-btn">Retry</button>
    </div>

    <div v-else-if="collections.length === 0 && !category?.placeholder" class="empty-state">
      <p>No collections found in this category.</p>
    </div>

    <div v-else class="collections-grid">
      <router-link
        v-for="collection in collections"
        :key="collection.id"
        :to="{ name: 'Collection', params: { collectionId: collection.id } }"
        class="collection-link"
      >
        {{ collection.displayName }}
        <span class="arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArchiveNavigation } from '@/composables/useArchiveNavigation'

const route = useRoute()
const { getCollections, getCategory, error } = useArchiveNavigation()

const categoryId = ref('')
const category = ref(null)
const collections = ref([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true

  categoryId.value = route.params.categoryId
  ;[category.value, collections.value] = await Promise.all([
    getCategory(categoryId.value),
    getCollections(categoryId.value),
  ])

  loading.value = false
}

onMounted(loadData)
</script>

<style scoped>
.category-page {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
}

.archive-header {
  text-align: center;
  margin-bottom: 5rem;
}

.archive-title {
  font-family: 'Helvetica Now', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #222;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.archive-description {
  font-family: 'Helvetica Now', sans-serif;
  color: #555;
  margin: 0 auto;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2c2c2c;
  font-weight: 400;
  max-width: 720px;
}

.breadcrumb {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  color: #aaa;
  letter-spacing: 1px;
}

.breadcrumb a {
  color: #999;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb a:hover {
  color: #000;
}

.breadcrumb .current {
  color: #666;
}

.breadcrumb span {
  margin: 0 0.4rem;
}

.placeholder-text {
  text-align: center;
  font-size: 1rem;
  color: #888;
  margin: 3rem auto;
  max-width: 600px;
  font-style: normal;
  line-height: 1.6;
}

.collections-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.collection-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #666;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
}

.collection-link .arrow {
  font-size: 0.9rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.collection-link:hover {
  color: #000;
  transform: translateX(4px);
}

.collection-link:hover .arrow {
  opacity: 1;
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
  width: 40px;
  height: 40px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #999;
  font-family: 'Helvetica Now', sans-serif;
}

.error-container {
  text-align: center;
  padding: 4rem;
  color: #ff4444;
}

.retry-btn {
  margin-top: 1rem;
  background: none;
  border: 1px solid #eaeaea;
  padding: 0.75rem 2rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-family: 'Helvetica Now', sans-serif;
}

.retry-btn:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem;
  }
  .archive-title {
    font-size: 1.5rem;
  }
  .archive-description {
    font-size: 0.85rem;
  }
  .breadcrumb {
    font-size: 0.7rem;
    margin-bottom: 2rem;
  }
  .collection-link {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }
}
</style>
