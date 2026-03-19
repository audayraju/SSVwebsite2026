const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')

export function apiUrl(path = '') {
  if (!path) return API_BASE_URL || ''
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath
}

export function assetUrl(path = '') {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return apiUrl(path)
}

export function productImageUrl(path = '') {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  const normalizedPath = path.startsWith('/uploads/')
    ? path
    : `/uploads/${path.replace(/^\/+/, '')}`
  return assetUrl(normalizedPath)
}
