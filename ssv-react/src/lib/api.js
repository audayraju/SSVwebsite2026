// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export function apiUrl(path = '') {
  if (!path) return API_BASE_URL || ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}

export function uploadsUrl(filename = '') {
  if (!filename) return ''
  if (filename.startsWith('http') || filename.startsWith('data:')) return filename
  const path = filename.startsWith('/uploads/') ? filename : `/uploads/${filename}`
  return apiUrl(path)
}

// ============================================================================
// Product API functions
// ============================================================================

/**
 * Fetch all products from MongoDB
 * @returns {Promise<Array>} Array of products with Cloudinary image URLs
 */
export async function fetchProducts() {
  try {
    const response = await fetch(apiUrl('/api/products'))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw error
  }
}

/**
 * Fetch a single product by ID
 * @param {string} productId - MongoDB ObjectId
 * @returns {Promise<Object>} Product object with Cloudinary image URL
 */
export async function fetchProduct(productId) {
  try {
    const response = await fetch(apiUrl(`/api/products/${productId}`))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error)
    throw error
  }
}

/**
 * Fetch products with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered products
 */
export async function fetchProductsByCategory(category) {
  try {
    const products = await fetchProducts()
    return products.filter(p => p.category === category)
  } catch (error) {
    console.error(`Failed to fetch products for category ${category}:`, error)
    throw error
  }
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching products
 */
export async function searchProducts(query) {
  try {
    const products = await fetchProducts()
    const q = query.toLowerCase()
    return products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  } catch (error) {
    console.error('Failed to search products:', error)
    throw error
  }
}
