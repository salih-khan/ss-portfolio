<template>
  <div class="collection-page">
    <div class="archive-header">
      <h1 class="archive-title">Archive // Elements</h1>
      <p class="archive-description">This ledger tracks the evolving visual timeline of Surma Studio. It is cataloged strictly into three sectors — wedding, editorial and product — allowing the work to be viewed as a continuous, uninterrupted exploration of the visual flow.</p>
    </div>

    <div class="breadcrumb">
      <router-link to="/archive">Archive</router-link>
      <span>/</span>
      <router-link :to="`/archive/${categoryId}`">{{ category?.displayName || '' }}</router-link>
      <span>/</span>
      <span class="current">{{ collection?.displayName || '' }}</span>
    </div>

    <div class="collection-header">
      <h2 class="collection-title">{{ collection?.displayName || '' }}</h2>
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
import { useArchiveNavigation } from '@/composables/useArchiveNavigation'

const route = useRoute()
const { getPhotosFromFolder } = useFirebasePhotos()
const { getCollection, getCategory } = useArchiveNavigation()

const collectionId = ref('')
const categoryId = ref('')
const category = ref(null)
const collection = ref(null)
const collectionPath = ref('')
const photos = ref([])
const hasMore = ref(false)
const nextOffset = ref(0)
const loading = ref(false)
const loadingMore = ref(false)

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

  collectionId.value = route.params.collectionId

  // Fetch collection data from Firestore
  collection.value = await getCollection(collectionId.value)

  if (collection.value) {
    // Get parent category for breadcrumb
    if (collection.value.parentId) {
      categoryId.value = collection.value.parentId
      category.value = await getCategory(categoryId.value)
    }

    collectionPath.value = collection.value.path
    await loadPhotos()
  }

  loading.value = false
})
</script>

<style scoped>
.collection-page {
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
  margin-bottom: 3rem;
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

.collection-header {
  text-align: center;
  margin-bottom: 4rem;
}

.collection-title {
  font-family: 'Helvetica Now', sans-serif;
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #333;
  margin-bottom: 0;
  text-transform: uppercase;
}

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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}

.load-more-btn {
  background: none;
  border: 1px solid #eaeaea;
  padding: 0.875rem 2.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  font-family: 'Helvetica Now', sans-serif;
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
  font-family: 'Helvetica Now', sans-serif;
  font-size: 0.8rem;
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
  font-family: 'Helvetica Now', sans-serif;
}

@media (max-width: 768px) {
  .collection-page {
    padding: 1rem;
  }
  .archive-title {
    font-size: 1.5rem;
  }
  .archive-description {
    font-size: 0.85rem;
  }
  .collection-title {
    font-size: 1.3rem;
  }
  .breadcrumb {
    font-size: 0.7rem;
    margin-bottom: 2rem;
  }
  .load-more-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.7rem;
  }
}
</style>
