<template>
  <div class="home">
    <div class="home-header">
      <div class="home-description-wrapper">
        <p class="home-description">
          <span
            ><b>Inspired by the river<br />Defined by the flow</b><br /><br
          /></span>
          Surma Studio is a UK-based photography business rooted in storytelling, movement and
          atmosphere. Inspired by the quiet flow of the Surma River, our approach is centred around
          capturing moments as they naturally unfold - honest, intentional and timeless.
          <br /><br />

          Working across editorial, weddings and product photography, we create imagery with a clean
          and considered perspective. Designed to be flexible and personal, our studio operates both
          on location and within bespoke, studio-style settings brought directly to our clients.<br /><br />

          Moving fluidly between digital precision and the nostalgic soul of film and Polaroid, we
          don't just take photos - we archive time.
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>Loading photographs...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>Error loading photos: {{ error.message }}</p>
    </div>

    <PhotoGrid v-else :photos-data="photos" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PhotoGrid from '@/components/PhotoGrid.vue'
import { useFirebasePhotos } from '@/composables/useFirebasePhotos'

const { getHomepagePhotos, error } = useFirebasePhotos()
const photos = ref([])
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true

  try {
    // Get 10 photos from homepage source (Home > Weddings fallback)
    const fetchedPhotos = await getHomepagePhotos(10)

    console.log('Fetched photos:', fetchedPhotos.length)

    photos.value = fetchedPhotos.map((photo) => ({
      src: photo.url,
      alt: photo.name.replace(/\.[^/.]+$/, ''), // Remove file extension for alt text
      caption: photo.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      loaded: false,
    }))
  } catch (err) {
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.home {
  min-height: calc(100vh - 120px);
}

.home-header {
  text-align: center;
  margin: 3rem 0 4rem 0;
}
.home-description-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
.home-description {
  font-size: 0.9rem;
  line-height: 1.8rem;
  color: #222222;
  letter-spacing: 0.02em;
  text-align: center;
  font-weight: 400;
  margin: 1rem;
}
.home-description span {
  text-transform: uppercase;
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
  border: 3px solid #f3f3f3;
  border-top: 3px solid #000000;
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

.loading-container p {
  color: #666;
  font-size: 0.9rem;
}

.error-container {
  text-align: center;
  padding: 4rem;
  color: #ff4444;
}

@media (max-width: 768px) {
  .home-header {
    margin: 2rem 0 2.5rem 0;
  }

  .home-description {
    font-size: 0.75rem;
    line-height: 1.5;
  }
  .home-description-wrapper {
    max-width: 600px;
  }
}
</style>
