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

export function useArchiveNavigation() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Get all categories (documents with no parentId)
   */
  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const categoriesRef = collection(db, 'categories')
      const q = query(
        categoriesRef,
        where('enabled', '==', true),
        where('parentId', '==', ''),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(q)

      const categories = []
      for (const doc of snapshot.docs) {
        categories.push({
          id: doc.id,
          ...doc.data()
        })
      }

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
   * Get collections for a specific category (by parentId)
   */
  const getCollections = async (categoryId) => {
    try {
      const collectionsRef = collection(db, 'categories')
      const q = query(
        collectionsRef,
        where('parentId', '==', categoryId),
        where('enabled', '==', true),
        orderBy('order', 'asc')
      )
      const snapshot = await getDocs(q)

      const collections = []
      for (const doc of snapshot.docs) {
        collections.push({
          id: doc.id,
          ...doc.data()
        })
      }

      return collections
    } catch (err) {
      console.error(`Error fetching collections for ${categoryId}:`, err)
      return []
    }
  }

  /**
   * Get a single category by ID
   */
  const getCategory = async (categoryId) => {
    try {
      const docRef = doc(db, 'categories', categoryId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching category:', err)
      return null
    }
  }

  /**
   * Get a single collection by ID
   */
  const getCollection = async (collectionId) => {
    try {
      const docRef = doc(db, 'categories', collectionId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
      return null
    } catch (err) {
      console.error('Error fetching collection:', err)
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
