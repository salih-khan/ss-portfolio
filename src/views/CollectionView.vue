<template>
  <div class="collection-page">
    <!-- Minimalist Archive Header -->
    <div class="archive-header">
      <h1 class="archive-title">Archive</h1>
    </div>

    <!-- Minimalist Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/archive">Archive</router-link>
      <span>/</span>
      <router-link :to="`/archive/${categoryName}`">{{
        formatCategoryForBreadcrumb(categoryName)
      }}</router-link>
      <span>/</span>
      <span class="current">{{ collectionDisplayName }}</span>
    </div>

    <div class="collection-header">
      <h2 class="collection-title">{{ collectionDisplayName }}</h2>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Loading photos...</p>
    </div>

    <div v-else-if="photos.length === 0" class="empty-state">
      <p>No photos found in this collection.</p>
    </div>

    <div v-else class="photos-container">
      <MasonryGrid :photos="photos" />

      <div class="load-more-container" v-if="hasMore && !loadingMore">
        <button @click="loadMore" class="load-more-btn">Load More Photos</button>
      </div>

      <div v-if="loadingMore" class="loading-more">
        <div class="mini-loader"></div>
        <span>Loading more...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MasonryGrid from '@/components/MasonryGrid.vue'
import { useFirebasePhotos } from '@/composables/useFirebasePhotos'

const route = useRoute()
const { getPhotosFromFolder } = useFirebasePhotos()

const collectionPath = ref('')
const categoryName = ref('')
const collectionDisplayName = ref('')
const photos = ref([])
const hasMore = ref(false)
const nextOffset = ref(0)
const loading = ref(false)
const loadingMore = ref(false)

const formatFromPath = (path) => {
  const parts = path.split('/')
  const collectionPart = parts[parts.length - 1]
  return collectionPart
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatCategoryForBreadcrumb = (name) => {
  return name
}

const loadPhotos = async (offset = 0) => {
  const result = await getPhotosFromFolder(collectionPath.value, 20, offset)

  if (offset === 0) {
    photos.value = result.images || []
  } else {
    photos.value = [...photos.value, ...(result.images || [])]
  }

  hasMore.value = result.hasMore || false
  nextOffset.value = result.nextOffset || 0
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  await loadPhotos(nextOffset.value)
  loadingMore.value = false
}

onMounted(async () => {
  loading.value = true

  const encodedPath = route.params.path
  collectionPath.value = decodeURIComponent(encodedPath)

  const pathParts = collectionPath.value.split('/')
  categoryName.value = pathParts[pathParts.length - 2] || ''
  collectionDisplayName.value = formatFromPath(collectionPath.value)

  await loadPhotos()
  loading.value = false
})
</script>

<style scoped>
.collection-page {
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
  margin-bottom: 2rem;
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

.collection-header {
  text-align: center;
  margin-bottom: 3rem;
}

.collection-title {
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #555;
  margin-bottom: 0;
  text-transform: uppercase;
}

/* Fix: Container that properly constrains the masonry grid */
.photos-container {
  width: 100%;
  overflow: visible;
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

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.load-more-btn {
  background: none;
  border: 1px solid #eaeaea;
  padding: 0.75rem 2rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.load-more-btn:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 3rem;
  color: #666;
}

.mini-loader {
  width: 18px;
  height: 18px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #999;
}

@media (max-width: 768px) {
  .collection-page {
    padding: 2rem 1rem;
  }

  .archive-title {
    font-size: 1.5rem;
    letter-spacing: 3px;
  }

  .collection-title {
    font-size: 1rem;
    letter-spacing: 1.5px;
  }
}
</style>
