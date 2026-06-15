<template>
  <div class="category-page">
    <!-- Minimalist Archive Header -->
    <div class="archive-header">
      <h1 class="archive-title">Archive</h1>
    </div>

    <!-- Minimalist Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/archive">Archive</router-link>
      <span>/</span>
      <span class="current">{{ categoryDisplayName }}</span>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading collections...</p>
    </div>

    <div v-else-if="collections.length === 0" class="empty-state">
      <p>No collections found in this category.</p>
    </div>

    <div v-else class="collections-grid">
      <router-link
        v-for="collection in collections"
        :key="collection.name"
        :to="{ name: 'Collection', params: { path: encodeURIComponent(collection.path) } }"
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
const { getCollections, loading } = useArchiveNavigation()

const categoryName = ref('')
const categoryDisplayName = ref('')
const collections = ref([])

const formatCategoryDisplayName = (name) => {
  const orderMap = {
    Weddings: 'Weddings',
    Portraits: 'Portraits',
    Landscapes: 'Landscapes',
    Events: 'Events',
    Commercial: 'Commercial',
    Personal: 'Personal Work',
  }
  return orderMap[name] || name
}

onMounted(async () => {
  categoryName.value = route.params.category
  categoryDisplayName.value = formatCategoryDisplayName(categoryName.value)

  const categoryPath = `Archive/${categoryName.value}`
  collections.value = await getCollections(categoryPath)
})
</script>

<style scoped>
.category-page {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 100vh;
}

.archive-header {
  text-align: center;
  margin-bottom: 3rem;
}

.archive-title {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 4px;
  color: #000;
  margin-bottom: 0;
  text-transform: uppercase;
}

.breadcrumb {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 0.75rem;
  color: #aaa;
  letter-spacing: 1px;
}

.breadcrumb a {
  color: #999;
  text-decoration: none;
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

.collections-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.collection-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 1px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 0.4rem 0.75rem;
}

.collection-link .arrow {
  font-size: 0.8rem;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #999;
}

@media (max-width: 768px) {
  .category-page {
    padding: 2rem 1rem;
  }

  .archive-title {
    font-size: 1.5rem;
    letter-spacing: 3px;
  }

  .collection-link {
    font-size: 0.85rem;
  }
}
</style>
