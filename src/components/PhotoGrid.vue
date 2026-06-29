<template>
  <div class="photo-grid-container">
    <div class="photo-grid">
      <div v-for="(photo, index) in photosWithLocalState" :key="photo.src" class="grid-item">
        <div class="image-wrapper">
          <img :src="photo.src" :alt="photo.alt" loading="lazy" @load="() => (imageLoaded[index] = true)" />
          <div v-if="!imageLoaded[index]" class="loading-shimmer"></div>
        </div>
        <div class="photo-caption" v-if="photo.caption">
          <!-- <span>{{ photo.caption }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  photosData: {
    type: Array,
    default: () => [],
  },
})

const imageLoaded = ref([])
const photosWithLocalState = ref([])

watch(
  () => props.photosData,
  (newPhotos) => {
    photosWithLocalState.value = newPhotos
    imageLoaded.value = new Array(newPhotos.length).fill(false)
  },
  { immediate: true, deep: true },
)
</script>

<style scoped>
.photo-grid-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 3rem;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.grid-item {
  width: 100%;
  animation: fadeIn 0.6s ease-in-out;
}

.image-wrapper {
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 2px;
  min-height: 250px;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.loading-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  animation: shimmer 1.5s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.photo-caption {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.grid-item:hover img {
  transform: scale(1.03);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .photo-grid {
    gap: 2rem;
  }

  .photo-grid-container {
    padding: 2rem;
  }
}

/* Mobile - Switch to 1 column */
@media (max-width: 768px) {
  .photo-grid-container {
    padding: 1rem;
  }

  .photo-grid {
    grid-template-columns: 1fr; /* Single column on mobile */
    gap: 2rem;
  }

  .photo-caption {
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }
}
</style>
