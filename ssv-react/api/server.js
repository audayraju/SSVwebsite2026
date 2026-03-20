'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const app = express()
const PORT = process.env.PORT ?? 3001

const GOOGLE_REVIEW_CACHE_MS = 10 * 60 * 1000
let googleReviewCache = { data: null, ts: 0 }

async function fetchJsonWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { signal: controller.signal })
    const json = await response.json()
    return { ok: response.ok, status: response.status, json }
  } finally {
    clearTimeout(timeout)
  }
}

// ---------------------------------------------------------------------------
// Data store — flat JSON file (no external DB required)
// ---------------------------------------------------------------------------
const IS_VERCEL = !!process.env.VERCEL
const DATA_DIR = IS_VERCEL ? '/tmp/ssv-data' : path.join(__dirname, 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const UPLOADS_DIR = IS_VERCEL ? '/tmp/ssv-uploads' : path.join(__dirname, 'uploads')

  ;[DATA_DIR, UPLOADS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })

function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    // On Vercel first cold-start, seed from the committed data file
    const seed = path.join(__dirname, 'data', 'products.json')
    if (fs.existsSync(seed)) {
      try { fs.copyFileSync(seed, PRODUCTS_FILE) } catch { /* ignore */ }
    }
  }
  if (!fs.existsSync(PRODUCTS_FILE)) return []
  try {
    const parsed = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'))
    const { normalized, changed } = normalizeProducts(parsed)
    if (changed) writeProducts(normalized)
    return normalized
  } catch {
    return []
  }
}

function writeProducts(data) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function parseImageIdNumber(imageId) {
  if (typeof imageId !== 'string') return 0
  const m = /^IMG-(\d{6})$/.exec(imageId.trim())
  return m ? Number(m[1]) : 0
}

function formatImageId(n) {
  return `IMG-${String(n).padStart(6, '0')}`
}

function getNextImageId(products) {
  const max = products.reduce((acc, p) => {
    const n = parseImageIdNumber(p?.imageId)
    return n > acc ? n : acc
  }, 0)
  return formatImageId(max + 1)
}

function normalizeInputImageId(raw) {
  if (raw === undefined || raw === null) return null
  const text = String(raw).trim().toUpperCase()
  if (!text) return null

  if (/^\d{1,6}$/.test(text)) {
    const n = Number(text)
    if (n < 1 || n > 999999) return null
    return formatImageId(n)
  }

  const m = /^IMG-(\d{1,6})$/.exec(text)
  if (!m) return null
  const n = Number(m[1])
  if (n < 1 || n > 999999) return null
  return formatImageId(n)
}

function validateRequestedImageId(rawImageId, products, currentProductId = null) {
  if (rawImageId === undefined || rawImageId === null || String(rawImageId).trim() === '') {
    return { ok: true, value: null }
  }

  const normalized = normalizeInputImageId(rawImageId)
  if (!normalized) {
    return {
      ok: false,
      message: 'Invalid image ID. Use a number (e.g. 12) or IMG-000012 format.',
    }
  }

  const duplicate = products.find(
    p => p.id !== currentProductId && p.imageId === normalized,
  )
  if (duplicate) {
    return {
      ok: false,
      message: `Image ID ${normalized} is already used by another product.`,
    }
  }

  return { ok: true, value: normalized }
}

function normalizeProducts(rawProducts) {
  const products = Array.isArray(rawProducts) ? rawProducts : []
  let maxIdNum = products.reduce((acc, p) => {
    const n = parseImageIdNumber(p?.imageId)
    return n > acc ? n : acc
  }, 0)

  let changed = false
  const normalized = products.map(p => {
    const hasImage = !!(p?.image && String(p.image).trim())
    const isValidImageId = parseImageIdNumber(p?.imageId) > 0

    if (!hasImage && p?.imageId) {
      changed = true
      return { ...p, imageId: null }
    }

    if (hasImage && !isValidImageId) {
      maxIdNum += 1
      changed = true
      return { ...p, imageId: formatImageId(maxIdNum) }
    }

    return p
  })

  return { normalized, changed }
}

function sortProductsByImageId(products) {
  return [...products].sort((a, b) => {
    const aId = parseImageIdNumber(a?.imageId)
    const bId = parseImageIdNumber(b?.imageId)
    if (aId === bId) return 0
    if (aId === 0) return 1
    if (bId === 0) return -1
    return aId - bId
  })
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'ssvadmin'
// Pre-hash the password at startup so every comparison is constant-time
const ADMIN_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? 'SSV@Admin2025', 10)
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'changeme'

// Simple HMAC token — avoids a JWT library dependency
function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyToken(token) {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
  // Constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  req.admin = payload
  next()
}

// ---------------------------------------------------------------------------
// Multer — image uploads (memory storage → base64 in JSON)
// ---------------------------------------------------------------------------
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true)
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed.'))
  },
})

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: (origin, cb) => {
    if (
      !origin ||
      /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
      /\.vercel\.app$/.test(origin) ||
      (process.env.CLIENT_ORIGIN && origin === process.env.CLIENT_ORIGIN)
    ) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
// Note: /uploads static route removed — images stored as base64 data URLs in JSON

// ---------------------------------------------------------------------------
// Public routes
// ---------------------------------------------------------------------------

// Health-check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Live Google reviews (auto-updating)
app.get('/api/google-reviews', async (_req, res) => {
  const now = Date.now()
  if (googleReviewCache.data && (now - googleReviewCache.ts) < GOOGLE_REVIEW_CACHE_MS) {
    return res.json(googleReviewCache.data)
  }

  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeQuery = process.env.GOOGLE_PLACE_QUERY ?? 'Sri shakthi Vinayaka Jewellers Vidya Nagar Hyderabad'

  if (!googleApiKey) {
    return res.status(503).json({
      message: 'Google reviews are not configured. Set GOOGLE_PLACES_API_KEY.',
      reviews: [],
    })
  }

  try {
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeQuery)}&inputtype=textquery&fields=place_id,name&key=${googleApiKey}`
    const findPlace = await fetchJsonWithTimeout(findPlaceUrl)

    if (!findPlace.ok || findPlace.json?.status === 'REQUEST_DENIED') {
      return res.status(502).json({ message: 'Unable to resolve Google place.', reviews: [] })
    }

    const placeId = findPlace.json?.candidates?.[0]?.place_id
    if (!placeId) {
      return res.status(404).json({ message: 'Google place not found for configured query.', reviews: [] })
    }

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,reviews,url&reviews_sort=newest&language=en&key=${googleApiKey}`
    const details = await fetchJsonWithTimeout(detailsUrl)

    if (!details.ok || !details.json?.result) {
      return res.status(502).json({ message: 'Unable to fetch Google place details.', reviews: [] })
    }

    const result = details.json.result
    const reviews = Array.isArray(result.reviews)
      ? result.reviews.map(r => ({
        name: r.author_name ?? 'Google User',
        rating: Number(r.rating ?? 5),
        text: r.text ?? '',
        when: r.relative_time_description || (r.time ? new Date(r.time * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
        meta: 'Google review',
        photoUrl: r.profile_photo_url ?? '',
      }))
      : []

    const payload = {
      placeName: result.name ?? 'SSV Jewellers',
      rating: Number(result.rating ?? 0),
      totalRatings: Number(result.user_ratings_total ?? 0),
      reviews,
      googleMapsUrl: result.url ?? '',
      updatedAt: new Date().toISOString(),
    }

    googleReviewCache = { data: payload, ts: now }
    return res.json(payload)
  } catch (err) {
    return res.status(500).json({ message: `Google reviews fetch failed: ${err.message}`, reviews: [] })
  }
})

// List all products (public)
app.get('/api/products', (_req, res) => {
  const products = sortProductsByImageId(readProducts())
  res.json(products)
})

// Single product (public)
app.get('/api/products/:id', (req, res) => {
  const products = readProducts()
  const product = products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
})

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body ?? {}

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.length > 100 ||
    password.length > 200
  ) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const userMatch = username === ADMIN_USER
  // Always run bcrypt compare to prevent timing-based username enumeration
  const passMatch = await bcrypt.compare(password, ADMIN_HASH)

  if (!userMatch || !passMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken({ role: 'admin', iat: Date.now() })
  res.json({ token })
})

// ---------------------------------------------------------------------------
// Admin — protected product routes
// ---------------------------------------------------------------------------

// List all (admin view — same data, different auth)
app.get('/api/admin/products', requireAdmin, (_req, res) => {
  res.json(sortProductsByImageId(readProducts()))
})

// Get single product (admin edit)
app.get('/api/admin/products/:id', requireAdmin, (req, res) => {
  const product = readProducts().find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json(product)
})

// Add product
app.post('/api/admin/products', requireAdmin, upload.single('productImage'), (req, res) => {
  const {
    productName,
    productCategory,
    productPrice,
    productDescription,
    productAdditionalInfo,
    productType,
    productSpecs,
    productImageId,
    imageId,
  } = req.body ?? {}

  if (!productName || !productCategory) {
    return res.status(400).json({ message: 'Name and category are required.' })
  }

  const products = readProducts()
  const requestedImageId = productImageId ?? imageId
  const requestedIdResult = validateRequestedImageId(requestedImageId, products)
  if (!requestedIdResult.ok) {
    return res.status(400).json({ message: requestedIdResult.message })
  }

  const generatedImageId = req.file
    ? (requestedIdResult.value ?? getNextImageId(products))
    : null
  const product = {
    id: uuidv4(),
    name: String(productName).slice(0, 200),
    category: String(productCategory).slice(0, 50),
    price: productPrice ? parseFloat(productPrice) : null,
    description: productDescription ? String(productDescription).slice(0, 2000) : '',
    additionalInfo: productAdditionalInfo ? String(productAdditionalInfo).slice(0, 1000) : '',
    type: productType ? String(productType).slice(0, 100) : '',
    specs: productSpecs
      ? String(productSpecs).split('\n').map(s => s.trim()).filter(Boolean)
      : [],
    image: req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : null,
    imageId: generatedImageId,
    createdAt: new Date().toISOString(),
  }

  products.push(product)
  writeProducts(products)
  res.status(201).json(product)
})

// Update product
app.put('/api/admin/products/:id', requireAdmin, upload.single('productImage'), (req, res) => {
  const products = readProducts()
  const idx = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Product not found' })

  const existing = products[idx]
  const {
    productName,
    productCategory,
    productPrice,
    productDescription,
    productAdditionalInfo,
    productType,
    productSpecs,
    productImageId,
    imageId,
  } = req.body ?? {}

  const requestedImageId = productImageId ?? imageId
  const requestedIdResult = validateRequestedImageId(requestedImageId, products, existing.id)
  if (!requestedIdResult.ok) {
    return res.status(400).json({ message: requestedIdResult.message })
  }

  // If a new image was uploaded, delete old file only when it is a file path.
  // (Current products usually store image as data URL; trying fs.existsSync on
  // those huge strings can fail on some platforms.)
  if (
    req.file &&
    existing.image &&
    typeof existing.image === 'string' &&
    !existing.image.startsWith('data:') &&
    !existing.image.startsWith('http')
  ) {
    const oldPath = path.join(UPLOADS_DIR, existing.image)
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
  }

  products[idx] = {
    ...existing,
    name: productName ? String(productName).slice(0, 200) : existing.name,
    category: productCategory ? String(productCategory).slice(0, 50) : existing.category,
    price: productPrice !== undefined ? parseFloat(productPrice) : existing.price,
    description: productDescription ? String(productDescription).slice(0, 2000) : existing.description,
    additionalInfo: productAdditionalInfo ? String(productAdditionalInfo).slice(0, 1000) : existing.additionalInfo,
    type: productType ? String(productType).slice(0, 100) : existing.type,
    specs: productSpecs
      ? String(productSpecs).split('\n').map(s => s.trim()).filter(Boolean)
      : existing.specs,
    image: req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : existing.image,
    imageId: requestedIdResult.value
      ?? (existing.image ? (existing.imageId ?? getNextImageId(products)) : null),
    updatedAt: new Date().toISOString(),
  }

  writeProducts(products)
  res.json(products[idx])
})

// Delete product
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const products = readProducts()
  const idx = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Product not found' })

  const [removed] = products.splice(idx, 1)

  writeProducts(products)
  res.json({ message: 'Product deleted', id: removed.id })
})

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'Image must be smaller than 2 MB.' })
  }
  console.error(err.message)
  res.status(500).json({ message: err.message ?? 'Internal server error' })
})

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SSV API running on http://localhost:${PORT}`)
  })
}

module.exports = app
