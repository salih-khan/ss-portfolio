<template>
  <div class="masonry-container">
    <!-- Mobile: Simple grid layout -->
    <div v-if="isMobile" class="mobile-grid">
      <div v-for="(photo, index) in photos" :key="photo.url" class="mobile-grid-item">
        <div class="image-wrapper">
          <img :src="photo.url" :alt="photo.name" loading="lazy" />
          <div class="image-overlay">
            <span class="image-name">{{ formatName(photo.name) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop/Tablet: Masonry layout -->
    <div v-else class="masonry-grid" ref="masonryGrid">
      <div
        v-for="(photo, index) in photos"
        :key="photo.url + index"
        class="grid-item"
        :style="{
          width: columnWidth + 'px',
          position: 'absolute',
          left: itemPositions[index]?.left + 'px',
          top: itemPositions[index]?.top + 'px',
        }"
      >
        <div class="image-wrapper">
          <img
            :src="photo.url"
            :alt="photo.name"
            @load="(event) => onImageLoad(index, event)"
            :style="{ opacity: loadedImages[index] ? 1 : 0 }"
            loading="lazy"
          />
          <div v-if="!loadedImages[index]" class="image-placeholder"></div>
          <div class="image-overlay">
            <span class="image-name">{{ formatName(photo.name) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'

const props = defineProps({
  photos: {
    type: Array,
    default: () => [],
  },
})

// Detect mobile screen
const isMobile = ref(window.innerWidth <= 768)

const masonryGrid = ref(null)
const loadedImages = ref({})
const columnWidth = ref(300)
const columns = ref(3)
const itemPositions = ref({})
const itemHeights = ref({})

const updateColumns = () => {
  if (isMobile.value) return

  const width = window.innerWidth
  if (width >= 1600) {
    columns.value = 4
  } else if (width >= 1200) {
    columns.value = 3
  } else if (width >= 768) {
    columns.value = 2
  } else {
    columns.value = 1
  }

  const containerWidth = masonryGrid.value?.parentElement?.offsetWidth || window.innerWidth
  const gap = 24
  columnWidth.value = (containerWidth - (columns.value - 1) * gap) / columns.value
}

const repositionItems = () => {
  if (isMobile.value || !masonryGrid.value || props.photos.length === 0) return

  const columnHeights = new Array(columns.value).fill(0)
  const newPositions = {}

  for (let i = 0; i < props.photos.length; i++) {
    let minHeightColumn = 0
    for (let j = 0; j < columns.value; j++) {
      if (columnHeights[j] < columnHeights[minHeightColumn]) {
        minHeightColumn = j
      }
    }

    const left = minHeightColumn * (columnWidth.value + 24)
    const top = columnHeights[minHeightColumn]

    newPositions[i] = {
      left: left,
      top: top,
      column: minHeightColumn,
    }

    const itemHeight = itemHeights.value[i] || 300
    columnHeights[minHeightColumn] += itemHeight + 24
  }

  itemPositions.value = newPositions

  const maxHeight = Math.max(...columnHeights)
  masonryGrid.value.style.height = `${maxHeight}px`
  masonryGrid.value.style.position = 'relative'
}

const onImageLoad = (index, event) => {
  if (isMobile.value) return
  if (!event || !event.target) return
  if (loadedImages.value[index]) return

  const img = event.target
  const height = img.naturalHeight
  const width = img.naturalWidth

  if (!width || !height) return

  const aspectRatio = height / width
  const displayedHeight = columnWidth.value * aspectRatio

  itemHeights.value[index] = displayedHeight
  loadedImages.value[index] = true

  nextTick(() => {
    repositionItems()
  })
}

const formatName = (name) => {
  return name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
}

// Handle resize
let resizeTimeout
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const newIsMobile = window.innerWidth <= 768
    if (newIsMobile !== isMobile.value) {
      isMobile.value = newIsMobile
    }
    if (!isMobile.value) {
      updateColumns()
      nextTick(() => repositionItems())
    }
  }, 250)
}

watch(
  () => props.photos.length,
  () => {
    if (!isMobile.value) {
      nextTick(() => repositionItems())
    }
  },
)

onMounted(() => {
  updateColumns()
  if (!isMobile.value) {
    repositionItems()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.masonry-container {
  width: 100%;
  overflow: visible;
}

/* Desktop Masonry Grid */
.masonry-grid {
  position: relative;
  width: 100%;
  min-height: 400px;
  transition: height 0.3s ease;
}

.grid-item {
  transition: all 0.3s ease;
  margin-bottom: 0;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

/* Mobile Simple Grid */
.mobile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.mobile-grid-item {
  width: 100%;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.4s ease;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  animation: shimmer 1.5s infinite;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 2rem 1rem 0.75rem 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-name {
  color: white;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.image-wrapper:hover img {
  transform: scale(1.03);
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeInUp {
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
@media (max-width: 1024px) and (min-width: 769px) {
  .mobile-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .grid-item {
    animation-delay: 0s !important;
  }
}
</style>
