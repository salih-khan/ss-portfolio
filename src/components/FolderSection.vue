<template>
  <div class="folder-section">
    <div class="folder-header">
      <h2 class="folder-title">
        <b>{{ folderName }}</b>
      </h2>
      <div class="folder-stats" v-if="totalPhotos > 0">
        <span>{{ displayedPhotos.length }} / {{ totalPhotos }} photos</span>
      </div>
    </div>

    <MasonryGrid :photos="displayedPhotos" :key="folderName" />

    <div class="load-more-container" v-if="hasMore && !loadingMore">
      <button @click.prevent="loadMore" class="load-more-btn">Load More Photos</button>
    </div>

    <div v-if="loadingMore" class="loading-more">
      <div class="mini-loader"></div>
      <span>Loading more...</span>
    </div>

    <div v-if="displayedPhotos.length === 0 && !loading" class="empty-state">
      <p>No photos in this folder yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MasonryGrid from './MasonryGrid.vue'

const props = defineProps({
  folderName: {
    type: String,
    required: true,
  },
  initialPhotos: {
    type: Array,
    default: () => [],
  },
  total: {
    type: Number,
    default: 0,
  },
  hasMoreData: {
    type: Boolean,
    default: false,
  },
  isLoadingMore: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['load-more'])

// Make displayedPhotos reactive to prop changes
const displayedPhotos = ref([])
const totalPhotos = ref(0)
const hasMore = ref(false)
const loadingMore = ref(false)

// Watch for prop updates from parent
watch(
  () => props.initialPhotos,
  (newPhotos) => {
    displayedPhotos.value = newPhotos
  },
  { immediate: true, deep: true },
)

watch(
  () => props.total,
  (newTotal) => {
    totalPhotos.value = newTotal
  },
  { immediate: true },
)

watch(
  () => props.hasMoreData,
  (newHasMore) => {
    hasMore.value = newHasMore
  },
  { immediate: true },
)

watch(
  () => props.isLoadingMore,
  (newLoading) => {
    loadingMore.value = newLoading
  },
  { immediate: true },
)

// Load more - emit to parent
const loadMore = () => {
  if (loadingMore.value || !hasMore.value) return
  emit('load-more')
}
</script>

<style scoped>
/* ... keep your existing styles exactly as they were ... */
.folder-section {
  margin-bottom: 5rem;
}

.folder-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eaeaea;
}

.folder-title {
  font-size: 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #000000;
  margin: 0;
}

.folder-stats {
  font-size: 0.8rem;
  color: #999;
  letter-spacing: 0.5px;
  font-weight: 400;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.load-more-btn {
  background: none;
  border: 1px solid #eaeaea;
  padding: 0.875rem 2.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 400;
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
  font-size: 0.8rem;
}

.mini-loader {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .folder-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .folder-title {
    font-size: 1.25rem;
  }

  .folder-stats {
    font-size: 0.7rem;
  }

  .load-more-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.75rem;
  }
}
</style>
