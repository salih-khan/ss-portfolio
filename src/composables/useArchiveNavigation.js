// composables/useArchiveNavigation.js
import { ref } from 'vue'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '@/firebase/config'

const TIMEOUT_MS = 10000
const CACHE_TTL = 300000 // 5 minutes

const withTimeout = (promise, ms = TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), ms)
    ),
  ])

// Module-level cache — persists across all useArchiveNavigation() instances
// within the same browser session (module is loaded once per page load).
const cache = new Map()

const getCached = (key) => {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) return null
  return entry.value
}

const setCached = (key, value) => {
  cache.set(key, { value, timestamp: Date.now() })
}

export function useArchiveNavigation() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Normalize a document from Firestore to have consistent field names
   * Converts: Display-Name → displayName, Parent-Id → parentId, Path → path
   */
  const normalizeDocument = (data) => {
    return {
      // Normalize display name
      displayName: data.displayName ||
                   data['Display-Name'] ||
                   data['display-name'] ||
                   data.display_name ||
                   data.name ||
                   data.title ||
                   'Untitled',

      // Normalize placeholder
      placeholder: data.placeholder ||
                   data['Placeholder'] ||
                   data['placeholder-text'] ||
                   data.placeholderText ||
                   null,

      // Normalize path
      path: data.path ||
            data['Path'] ||
            data.storagePath ||
            data.folderPath ||
            '',

      // Normalize parentId
      parentId: data.parentId !== undefined ? data.parentId :
                data['Parent-Id'] !== undefined ? data['Parent-Id'] :
                data['parent-id'] !== undefined ? data['parent-id'] :
                data.parent_id !== undefined ? data.parent_id :
                '',

      // Normalize enabled
      enabled: data.enabled !== undefined ? data.enabled :
               data['Enabled'] !== undefined ? data['Enabled'] :
               data['enabled'] !== undefined ? data['enabled'] :
               true,

      // Normalize order
      order: data.order !== undefined ? data.order :
             data['Order'] !== undefined ? data['Order'] :
             data['order'] !== undefined ? data['order'] :
             999,
    }
  }

  /**
   * Get all categories (documents with no parentId)
   */
  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const cached = getCached('categories')
      if (cached) return cached

      const categoriesRef = collection(db, 'categories')
      const snapshot = await withTimeout(getDocs(categoriesRef))

      const categories = []
      for (const doc of snapshot.docs) {
        const data = doc.data()
        const normalized = normalizeDocument(data)

        // Check if it's a category (parentId is empty) and enabled
        if (normalized.parentId === '' && normalized.enabled === true) {
          categories.push({
            id: doc.id,
            ...normalized
          })
        }
      }

      // Sort by order
      categories.sort((a, b) => (a.order || 999) - (b.order || 999))
      setCached('categories', categories)
      return categories
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err.message || 'Failed to load categories.'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get collections for a specific category (by parentId)
   */
  const getCollections = async (categoryId) => {
    const cacheKey = `collections:${categoryId}`
    try {
      const cached = getCached(cacheKey)
      if (cached) {
        error.value = null
        return cached
      }

      const collectionsRef = collection(db, 'categories')
      const q = query(collectionsRef, where('Parent-Id', '==', categoryId))
      const snapshot = await withTimeout(getDocs(q))

      const collections = []
      for (const doc of snapshot.docs) {
        const data = doc.data()
        const normalized = normalizeDocument(data)

        if (normalized.enabled === true) {
          collections.push({
            id: doc.id,
            ...normalized,
          })
        }
      }

      collections.sort((a, b) => (a.order || 999) - (b.order || 999))

      setCached(cacheKey, collections)
      return collections
    } catch (err) {
      console.error(`Error fetching collections for ${categoryId}:`, err)
      error.value = err.message || 'Failed to load collections.'
      return []
    }
  }

  /**
   * Get a single category by ID
   */
  const getCategory = async (categoryId) => {
    const cacheKey = `category:${categoryId}`
    try {
      const cached = getCached(cacheKey)
      if (cached) {
        error.value = null
        return cached
      }

      const docRef = doc(db, 'categories', categoryId)
      const docSnap = await withTimeout(getDoc(docRef))

      if (docSnap.exists()) {
        const result = {
          id: docSnap.id,
          ...normalizeDocument(docSnap.data())
        }
        setCached(cacheKey, result)
        return result
      }
      return null
    } catch (err) {
      console.error('Error fetching category:', err)
      error.value = err.message || 'Failed to load category.'
      return null
    }
  }

  /**
   * Get a single collection by ID
   */
  const getCollection = async (collectionId) => {
    const cacheKey = `collection:${collectionId}`
    try {
      const cached = getCached(cacheKey)
      if (cached) {
        error.value = null
        return cached
      }

      const docRef = doc(db, 'categories', collectionId)
      const docSnap = await withTimeout(getDoc(docRef))

      if (docSnap.exists()) {
        const result = {
          id: docSnap.id,
          ...normalizeDocument(docSnap.data())
        }
        setCached(cacheKey, result)
        return result
      }
      return null
    } catch (err) {
      console.error('Error fetching collection:', err)
      error.value = err.message || 'Failed to load collection.'
      return null
    }
  }

  /**
   * Get full archive structure (categories + their collections)
   */
  const getFullArchiveStructure = async () => {
    loading.value = true

    try {
      const categories = await getCategories()
      const structure = []

      for (const category of categories) {
        const collections = await getCollections(category.id)
        structure.push({
          ...category,
          collections: collections,
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

  return {
    loading,
    error,
    getCategories,
    getCollections,
    getCategory,
    getCollection,
    getFullArchiveStructure,
  }
}
