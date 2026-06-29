import { ref } from 'vue'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

const TIMEOUT_MS = 10000
const CACHE_TTL = 300000 // 5 minutes

const withTimeout = (promise, ms = TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    ),
  ])

// Module-level cache — persists across all useFirebasePhotos() instances
// within the same browser session (module is loaded once per page load).
const photoCache = new Map()

const getCached = (key) => {
  const entry = photoCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) return null
  return entry.value
}

const setCached = (key, value) => {
  photoCache.set(key, { value, timestamp: Date.now() })
}

export function useFirebasePhotos() {
  const photos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Extract number from filename for sorting
  const extractNumber = (filename) => {
    const match = filename.match(/(\d+)/)
    return match ? parseInt(match[0]) : 0
  }

  // Get all items from a folder with sorting
  const getAllItemsFromFolder = async (folderPath) => {
    const folderRef = storageRef(storage, folderPath)
    const result = await withTimeout(listAll(folderRef))

    // Sort items by numeric value in filename
    const sortedItems = result.items.sort((a, b) => {
      const numA = extractNumber(a.name)
      const numB = extractNumber(b.name)
      return numA - numB
    })

    return sortedItems
  }

  // Get photos from a specific folder with pagination
  const getPhotosFromFolder = async (folderPath, limit = 20, offset = 0) => {
    const cacheKey = `${folderPath}:${offset}:${limit}`
    try {
      const cached = getCached(cacheKey)
      if (cached) {
        error.value = null
        return cached
      }

      const sortedItems = await getAllItemsFromFolder(folderPath)

      // Get the slice based on offset
      const paginatedItems = sortedItems.slice(offset, offset + limit)

      // N+1 pattern: one getDownloadURL() round-trip per image, run in parallel.
      // This could be replaced with a direct public URL construction:
      //   https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media
      // which requires zero extra network requests. However, that only works when
      // the Storage bucket allows public reads, and no storage.rules file is present
      // in this repo to confirm the access policy. Change this once public access
      // is verified (bucket name is in VITE_FIREBASE_STORAGE_BUCKET).
      const imagePromises = paginatedItems.map(async (itemRef) => {
        const url = await withTimeout(getDownloadURL(itemRef))
        return {
          url: url,
          name: itemRef.name,
          path: itemRef.fullPath,
          folder: folderPath,
        }
      })

      const images = await withTimeout(Promise.all(imagePromises))

      const result = {
        images: images,
        total: sortedItems.length,
        hasMore: offset + limit < sortedItems.length,
        nextOffset: offset + limit,
      }
      setCached(cacheKey, result)
      return result
    } catch (err) {
      console.error(`Error fetching from ${folderPath}:`, err)
      error.value = err.message || 'Failed to load photos.'
      return {
        images: [],
        total: 0,
        hasMore: false,
        nextOffset: 0,
      }
    }
  }

  // Check if a folder exists
  const folderExists = async (folderPath) => {
    try {
      const folderRef = storageRef(storage, folderPath)
      const result = await listAll(folderRef)
      return result.items.length > 0 || result.prefixes.length > 0
    } catch (err) {
      return false
    }
  }

  // Get homepage highlights (Home folder, falls back to Weddings if Home is empty)
  const getHomepagePhotos = async (limit = 10) => {
    loading.value = true
    error.value = null

    try {
      let sortedItems = await getAllItemsFromFolder('Home')
      let folderToUse = 'Home'

      if (sortedItems.length === 0) {
        console.log('Home folder empty, using Weddings folder')
        folderToUse = 'Weddings'
        sortedItems = await getAllItemsFromFolder('Weddings')
      }

      const paginatedItems = sortedItems.slice(0, limit)

      // N+1 pattern — see matching comment in getPhotosFromFolder.
      const imagePromises = paginatedItems.map(async (itemRef) => {
        const url = await withTimeout(getDownloadURL(itemRef))
        return {
          url: url,
          name: itemRef.name,
          path: itemRef.fullPath,
          folder: folderToUse,
        }
      })

      const images = await withTimeout(Promise.all(imagePromises))

      photos.value = images
      return images
    } catch (err) {
      console.error('Error fetching homepage photos:', err)
      error.value = err.message || 'Failed to load photos.'
      photos.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Get all available folders in storage (excluding Highlights)
  const getAllFolders = async () => {
    try {
      const rootRef = storageRef(storage, '')
      const result = await listAll(rootRef)
      const folders = result.prefixes
        .map((prefix) => prefix.name)
        .filter((folder) => folder !== 'Highlights')
      return folders
    } catch (err) {
      console.error('Error fetching folders:', err)
      error.value = err.message || 'Failed to load folders.'
      return []
    }
  }

  // Get all folders with their photos (for archive page)
  const getAllFolderPhotos = async (limitPerFolder = 20) => {
    loading.value = true
    error.value = null

    try {
      const folders = await getAllFolders()
      const folderData = {}

      for (const folder of folders) {
        const result = await getPhotosFromFolder(folder, limitPerFolder, 0)
        folderData[folder] = {
          photos: result.images,
          total: result.total,
          hasMore: result.hasMore,
          nextOffset: result.nextOffset,
        }
      }

      return folderData
    } catch (err) {
      console.error('Error fetching all folders:', err)
      error.value = err.message || 'Failed to load folders.'
      return {}
    } finally {
      loading.value = false
    }
  }

  // Load more photos for a specific folder using offset
  const loadMoreFolderPhotos = async (folderName, currentOffset, limit = 20) => {
    try {
      const result = await getPhotosFromFolder(folderName, limit, currentOffset)
      return result
    } catch (err) {
      console.error(`Error loading more photos from ${folderName}:`, err)
      error.value = err.message || 'Failed to load more photos.'
      return null
    }
  }

  return {
    photos,
    loading,
    error,
    getHomepagePhotos,
    getAllFolders,
    getAllFolderPhotos,
    loadMoreFolderPhotos,
    getPhotosFromFolder,
    folderExists,
  }
}
