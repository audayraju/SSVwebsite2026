'use strict'

require('dotenv').config()

const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const cors = require('cors')
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const mongoose = require('mongoose')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvjewellers'
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[MongoDB] Connected'))
  .catch(err => {
    console.error('[MongoDB] Connection error:', err)
    process.exit(1)
  })

// Product schema (Cloudinary image)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  imageId: { type: String, required: true, unique: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String },
  additionalInformation: { type: String },
  type: { type: String },
  specifications: [{ type: String }],
  createdAt: Date,
  updatedAt: Date,
})
const Product = mongoose.model('Product', productSchema)

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
})
const upload = multer({ storage })

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
    console.log(`[fetchJsonWithTimeout] Fetching: ${url}`)
    const response = await fetch(url, { signal: controller.signal })
    const json = await response.json()
    console.log(`[fetchJsonWithTimeout] Response status: ${response.status}`)
    return { ok: response.ok, status: response.status, json }
  } catch (err) {
    console.error(`[fetchJsonWithTimeout] Error:`, err)
    throw err
  } finally {
    clearTimeout(timeout)
  }
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
const ADMIN_USER = (process.env.ADMIN_USERNAME ?? 'ssvadmin').trim()
// Pre-hash the password at startup so every comparison is constant-time
const ADMIN_HASH = bcrypt.hashSync((process.env.ADMIN_PASSWORD ?? 'SSV@Admin2025').trim(), 10)
const TOKEN_SECRET = (process.env.TOKEN_SECRET ?? 'changeme').trim()

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
    console.warn('[requireAdmin] Unauthorized access attempt')
    return res.status(401).json({ message: 'Unauthorized' })
  }
  req.admin = payload
  next()
}



// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: (origin, cb) => {
    if (
      !origin ||
      /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /^https?:\/\/(www\.)?ssvjewellers\.com$/.test(origin) ||
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
app.get('/api/health', (_req, res) => {
  console.log('[GET] /api/health')
  res.json({ status: 'ok' })
})

// Live Google reviews (auto-updating)
app.get('/api/google-reviews', async (_req, res) => {
    console.log('[GET] /api/google-reviews')
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
app.get('/api/products', async (_req, res) => {
  console.log('[GET] /api/products')
  try {
    const products = await Product.find().sort({ imageId: 1 })
    res.json(products)
  } catch (err) {
    console.error('[GET] /api/products error:', err)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// Single product (public)
app.get('/api/products/:id', async (req, res) => {
  console.log(`[GET] /api/products/${req.params.id}`)
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      console.warn(`[GET] /api/products/${req.params.id} not found`)
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error(`[GET] /api/products/${req.params.id} error:`, err)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// ---------------------------------------------------------------------------
// Admin auth
// ---------------------------------------------------------------------------
app.post('/api/admin/login', async (req, res) => {
    console.log('[POST] /api/admin/login')
  const { username, password } = req.body ?? {}

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username.length > 100 ||
    password.length > 200
  ) {
    console.warn('[admin/login] Invalid credentials format')
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const userMatch = username === ADMIN_USER
  // Always run bcrypt compare to prevent timing-based username enumeration
  const passMatch = await bcrypt.compare(password, ADMIN_HASH)

  if (!userMatch || !passMatch) {
    console.warn('[admin/login] Invalid credentials')
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken({ role: 'admin', iat: Date.now() })
  console.log('[admin/login] Login successful')
  res.json({ token })
})

// ---------------------------------------------------------------------------
// Admin — protected product routes
// ---------------------------------------------------------------------------

// List all (admin view — same data, different auth)
app.get('/api/admin/products', requireAdmin, async (_req, res) => {
  console.log('[GET] /api/admin/products')
  try {
    const products = await Product.find().sort({ imageId: 1 })
    res.json(products)
  } catch (err) {
    console.error('[GET] /api/admin/products error:', err)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// Get single product (admin edit)
app.get('/api/admin/products/:id', requireAdmin, async (req, res) => {
  console.log(`[GET] /api/admin/products/${req.params.id}`)
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      console.warn(`[GET] /api/admin/products/${req.params.id} not found`)
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (err) {
    console.error(`[GET] /api/admin/products/${req.params.id} error:`, err)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// Add product (with optional image upload as base64)

// Helper to auto-generate imageId
async function generateImageId() {
  const last = await Product.findOne().sort({ imageId: -1 })
  let num = 1
  if (last && last.imageId) {
    const match = last.imageId.match(/IMG-(\d+)/)
    if (match) num = parseInt(match[1], 10) + 1
  }
  return `IMG-${String(num).padStart(6, '0')}`
}

// Admin product upload (Cloudinary, multer, multipart/form-data)
app.post('/api/admin/products', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, description, additionalInformation, type, specifications, imageId } = req.body
    if (!name || !category) return res.status(400).json({ message: 'Name and category are required.' })
    if (!price || isNaN(price) || Number(price) <= 0) return res.status(400).json({ message: 'Price must be positive.' })
    if (!req.file) return res.status(400).json({ message: 'Product image is required.' })

    // Cloudinary result
    const imageUrl = req.file.path
    const imagePublicId = req.file.filename

    // Auto-generate imageId if not provided
    let finalImageId = imageId
    if (!finalImageId) finalImageId = await generateImageId()

    // Convert specifications (multi-line string to array)
    let specsArr = []
    if (specifications) {
      specsArr = specifications.split('\n').map(s => s.trim()).filter(Boolean)
    }

    const product = new Product({
      name: name.trim(),
      imageUrl,
      imagePublicId,
      imageId: finalImageId,
      category: category.trim(),
      price: Number(price),
      description: description || '',
      additionalInformation: additionalInformation || '',
      type: type || '',
      specifications: specsArr,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message })
  }
})

// Update product (with optional image upload as base64)
app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  console.log(`[PUT] /api/admin/products/${req.params.id}`)
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      console.warn(`[PUT] /api/admin/products/${req.params.id} not found`)
      return res.status(404).json({ message: 'Product not found' })
    }

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
      imageBase64,
      imageContentType,
    } = req.body ?? {}

    product.name = productName ? String(productName).slice(0, 200) : product.name;
    product.category = productCategory ? String(productCategory).slice(0, 50) : product.category;
    product.price = productPrice !== undefined ? parseFloat(productPrice) : product.price;
    product.description = productDescription ? String(productDescription).slice(0, 2000) : product.description;
    product.additionalInfo = productAdditionalInfo ? String(productAdditionalInfo).slice(0, 1000) : product.additionalInfo;
    product.type = productType ? String(productType).slice(0, 100) : product.type;
    product.specs = productSpecs
      ? String(productSpecs).split('\n').map(s => s.trim()).filter(Boolean)
      : product.specs;
    if (imageBase64 && imageContentType) {
      try {
        const buffer = Buffer.from(imageBase64, imageBase64.startsWith('data:') ? imageBase64.split(',')[1] : undefined ? 'base64' : 'base64')
        product.image = { data: buffer, contentType: imageContentType }
      } catch (e) {
        console.warn('[admin/products] Invalid imageBase64')
      }
    }
    product.imageId = productImageId ?? imageId ?? product.imageId;
    product.updatedAt = new Date().toISOString();

    await product.save();
    console.log(`[PUT] /api/admin/products/${req.params.id} updated`)
    res.json(product)
  } catch (err) {
    console.error(`[PUT] /api/admin/products/${req.params.id} error:`, err)
    res.status(500).json({ message: 'Failed to update product' })
  }
})
// Serve product image by product id (public)
app.get('/api/products/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product || !product.image || !product.image.data) {
      return res.status(404).json({ message: 'Image not found' })
    }
    res.set('Content-Type', product.image.contentType || 'image/jpeg')
    res.send(product.image.data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch image' })
  }
})

// Delete product
app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  console.log(`[DELETE] /api/admin/products/${req.params.id}`)
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      console.warn(`[DELETE] /api/admin/products/${req.params.id} not found`)
      return res.status(404).json({ message: 'Product not found' })
    }
    console.log(`[DELETE] Product deleted: ${product._id}`)
    res.json({ message: 'Product deleted', id: product._id })
  } catch (err) {
    console.error(`[DELETE] /api/admin/products/${req.params.id} error:`, err)
    res.status(500).json({ message: 'Failed to delete product' })
  }
})

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    console.warn('[error handler] File too large')
    return res.status(413).json({ message: 'Image must be smaller than 2 MB.' })
  }
  console.error('[error handler]', err.message)
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
