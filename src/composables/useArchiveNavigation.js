// composables/useArchiveNavigation.js
import { ref } from 'vue'
import { ref as storageRef, listAll } from 'firebase/storage'
import { storage } from '@/firebase/config'

export function useArchiveNavigation() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Get all major categories from /Archive folder
   * Returns: ['Weddings', 'Portraits', 'Commercial', ...]
   */
  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const archiveRef = storageRef(storage, 'Archive')
      const result = await listAll(archiveRef)

      const categories = result.prefixes.map((prefix) => ({
        name: prefix.name,
        path: `Archive/${prefix.name}`,
        displayName: formatCategoryName(prefix.name),
      }))

      return categories
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all subfolders (collections) inside a category
   * Example: getCollections('Archive/Weddings')
   * Returns: [{ name: 'Outside-Shots', path: 'Archive/Weddings/Outside-Shots', displayName: 'Outside Shots' }, ...]
   */
  const getCollections = async (categoryPath) => {
    try {
      const categoryRef = storageRef(storage, categoryPath)
      const result = await listAll(categoryRef)

      const collections = result.prefixes.map((prefix) => ({
        name: prefix.name,
        path: prefix.fullPath,
        displayName: formatCollectionName(prefix.name),
      }))

      return collections
    } catch (err) {
      console.error(`Error fetching collections from ${categoryPath}:`, err)
      return []
    }
  }

  /**
   * Get full archive structure with all categories and their collections
   */
  const getFullArchiveStructure = async () => {
    loading.value = true

    try {
      const categories = await getCategories()
      const structure = []

      for (const category of categories) {
        const collections = await getCollections(category.path)
        structure.push({
          ...category,
          collections: collections,
          expanded: false, // for UI state
        })
      }

      return structure
    } catch (err) {
      console.error('Error building archive structure:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const formatCategoryName = (name) => {
    const orderMap = {
      Wedding: '01 // Wedding',
      Editorial: '02 // Editorial',
      Product: '03 // Product',
    }
    return orderMap[name] || name
  }

  const formatCollectionName = (name) => {
    return name
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return {
    loading,
    error,
    getCategories,
    getCollections,
    getFullArchiveStructure,
    formatCollectionName,
  }
}
