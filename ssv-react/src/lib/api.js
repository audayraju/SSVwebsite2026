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
