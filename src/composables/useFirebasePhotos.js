import { ref } from 'vue'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

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
    const result = await listAll(folderRef)

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
    try {
      const sortedItems = await getAllItemsFromFolder(folderPath)

      // Get the slice based on offset
      const paginatedItems = sortedItems.slice(offset, offset + limit)

      // Get download URLs for paginated images
      const imagePromises = paginatedItems.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef)
        return {
          url: url,
          name: itemRef.name,
          path: itemRef.fullPath,
          folder: folderPath,
        }
      })

      const images = await Promise.all(imagePromises)

      return {
        images: images,
        total: sortedItems.length,
        hasMore: offset + limit < sortedItems.length,
        nextOffset: offset + limit,
      }
    } catch (err) {
      console.error(`Error fetching from ${folderPath}:`, err)
      error.value = err
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

  // Get homepage highlights
  const getHomepagePhotos = async (limit = 10) => {
    loading.value = true
    error.value = null

    try {
      const homeExist = await folderExists('Home')
      let folderToUse = 'Home'

      if (homeExist) {
        console.log('Using Home folder')
        folderToUse = 'Home'
      } else {
        console.log('Home folder not found, using Weddings folder')
      }

      const { images } = await getPhotosFromFolder(folderToUse, limit, 0)
      photos.value = images
      return images
    } catch (err) {
      console.error('Error fetching homepage photos:', err)
      error.value = err
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
      error.value = err
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
      error.value = err
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
      error.value = err
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
    getPhotosFromFolder, // ← Make sure this is included!

    folderExists,
  }
}
