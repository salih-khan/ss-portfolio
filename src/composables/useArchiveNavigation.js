// composables/useArchiveNavigation.js
import { ref } from 'vue'
import { ref as storageRef, listAll } from 'firebase/storage'
import { storage } from '@/firebase/config'

export function useArchiveNavigation() {
  const loading = ref(false)
  const error = ref(null)

  // ---------- SPECIAL CASES (hardcoded) ----------
  // Keys are lowercase for case‑insensitive matching.
  const specialCaseMapping = {
    'wedding': { number: '01', cleanName: 'Wedding', order: 1 },
    'archive-wedding': { number: '01', cleanName: 'Wedding', order: 1 },
    'editorial': { number: '02', cleanName: 'Editorial', order: 2 },
    'archive-editorial': { number: '02', cleanName: 'Editorial', order: 2 },
    'product': { number: '03', cleanName: 'Product', order: 3 },
    'archive-product': { number: '03', cleanName: 'Product', order: 3 },
  }

  // ---------- PARSING FUNCTION ----------
  const parseFolderName = (folderName) => {
    const lower = folderName.toLowerCase()

    // 1. Check special cases first (exact match, case‑insensitive)
    if (specialCaseMapping[lower]) {
      const { number, cleanName, order } = specialCaseMapping[lower]
      const displayName = `${number} // ${cleanName}`
      return {
        order,
        number,
        displayName,
        cleanName,
      }
    }

    // 2. If not a special case, try to parse the "folder-number-name" pattern
    const parts = folderName.split('-')
    let order = 999
    let number = '00'
    let cleanName = folderName
    let displayName = folderName

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (/^\d{2}$/.test(part)) { // exactly two digits
        order = parseInt(part, 10)
        number = part
        const nameParts = parts.slice(i + 1)
        cleanName = nameParts.join(' ').replace(/_/g, ' ')
        displayName = `${number} // ${formatDisplayName(cleanName)}`
        break
      }
    }

    // If no number found, treat it as a generic folder (no number)
    if (order === 999) {
      cleanName = folderName.replace(/^Archive-/, '').replace(/_/g, ' ')
      displayName = formatDisplayName(cleanName)
      number = '00'
    }

    return { order, number, displayName, cleanName }
  }

  // ---------- HELPER: FORMAT DISPLAY NAME ----------
  const formatDisplayName = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // ---------- GET CATEGORIES ----------
  const getCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const archiveRef = storageRef(storage, 'Archive')
      const result = await listAll(archiveRef)

      let categories = result.prefixes.map((prefix) => {
        const parsed = parseFolderName(prefix.name)
        return {
          name: prefix.name,
          path: `Archive/${prefix.name}`,
          displayName: parsed.displayName,
          order: parsed.order,
          number: parsed.number,
          cleanName: parsed.cleanName,
        }
      })

      // Sort by order (special cases have explicit orders, others use 999)
      categories.sort((a, b) => a.order - b.order)

      return categories
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err
      return []
    } finally {
      loading.value = false
    }
  }

  // ---------- GET COLLECTIONS (sub‑folders) ----------
  const getCollections = async (categoryPath) => {
    try {
      const categoryRef = storageRef(storage, categoryPath)
      const result = await listAll(categoryRef)

      let collections = result.prefixes.map((prefix) => {
        const parsed = parseFolderName(prefix.name)
        return {
          name: prefix.name,
          path: prefix.fullPath,
          displayName: parsed.displayName || formatCollectionName(prefix.name),
          order: parsed.order,
          number: parsed.number,
          cleanName: parsed.cleanName,
        }
      })

      // Sort collections by order (if available) then alphabetically
      collections.sort((a, b) => {
        if (a.order !== 999 && b.order !== 999) return a.order - b.order
        return a.displayName.localeCompare(b.displayName)
      })

      return collections
    } catch (err) {
      console.error(`Error fetching collections from ${categoryPath}:`, err)
      return []
    }
  }

  // ---------- GET FULL STRUCTURE (optional) ----------
  const getFullArchiveStructure = async () => {
    loading.value = true
    try {
      const categories = await getCategories()
      const structure = []
      for (const category of categories) {
        const collections = await getCollections(category.path)
        structure.push({
          ...category,
          collections,
          expanded: false,
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

  // ---------- HELPER: FORMAT COLLECTION NAME ----------
  const formatCollectionName = (name) => {
    return name
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // ---------- EXPOSE ----------
  return {
    loading,
    error,
    getCategories,
    getCollections,
    getFullArchiveStructure,
    formatCollectionName,
  }
}
