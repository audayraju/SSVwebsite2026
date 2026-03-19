'use strict'

require('dotenv').config()

const express  = require('express')
const cors     = require('cors')
const multer   = require('multer')
const path     = require('path')
const fs       = require('fs')
const { v4: uuidv4 } = require('uuid')
const bcrypt   = require('bcryptjs')
const crypto   = require('crypto')

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
const app  = express()
const PORT = process.env.PORT ?? 3001

// ---------------------------------------------------------------------------
// Data store — flat JSON file (no external DB required)
// ---------------------------------------------------------------------------
const IS_VERCEL     = !!process.env.VERCEL
const DATA_DIR      = IS_VERCEL ? '/tmp/ssv-data'    : path.join(__dirname, 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')
const UPLOADS_DIR   = IS_VERCEL ? '/tmp/ssv-uploads' : path.join(__dirname, 'uploads')

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
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'))
  } catch {
    return []
  }
}

function writeProducts(data) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function resolveUploadPath(imageValue) {
  if (!imageValue) return null
  if (typeof imageValue !== 'string') return null
  if (imageValue.startsWith('http') || imageValue.startsWith('data:')) return null

  const withoutLeadingSlash = imageValue.replace(/^\/+/, '')
  const filename = withoutLeadingSlash.startsWith('uploads/')
    ? withoutLeadingSlash.slice('uploads/'.length)
    : withoutLeadingSlash

  const safeFilename = path.basename(filename)
  if (!safeFilename) return null

  return path.join(UPLOADS_DIR, safeFilename)
}

function deleteUploadedImage(imageValue) {
  const filePath = resolveUploadPath(imageValue)
  if (!filePath) return
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath) } catch { /* ignore */ }
  }
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
  const sig  = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
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
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  req.admin = payload
  next()
}

// ---------------------------------------------------------------------------
// Multer — image uploads (disk storage)
// ---------------------------------------------------------------------------
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = MIME_TO_EXT[file.mimetype] ?? 'bin'
      cb(null, `${Date.now()}-${uuidv4()}.${ext}`)
    },
  }),
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
app.use('/uploads', express.static(UPLOADS_DIR))

// ---------------------------------------------------------------------------
// Public routes
// ---------------------------------------------------------------------------

// Health-check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// List all products (public)
app.get('/api/products', (_req, res) => {
  const products = readProducts()
  res.json(products)
})

// Single product (public)
app.get('/api/products/:id', (req, res) => {
  const products = readProducts()
  const product  = products.find(p => p.id === req.params.id)
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
  res.json(readProducts())
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
  } = req.body ?? {}

  if (!productName || !productCategory) {
    return res.status(400).json({ message: 'Name and category are required.' })
  }

  const products = readProducts()
  const product = {
    id:             uuidv4(),
    name:           String(productName).slice(0, 200),
    category:       String(productCategory).slice(0, 50),
    price:          productPrice ? parseFloat(productPrice) : null,
    description:    productDescription  ? String(productDescription).slice(0, 2000)  : '',
    additionalInfo: productAdditionalInfo ? String(productAdditionalInfo).slice(0, 1000) : '',
    type:           productType ? String(productType).slice(0, 100) : '',
    specs:          productSpecs
      ? String(productSpecs).split('\n').map(s => s.trim()).filter(Boolean)
      : [],
    image:          req.file ? req.file.filename : null,
    createdAt:      new Date().toISOString(),
  }

  products.unshift(product)
  writeProducts(products)
  res.status(201).json(product)
})

// Update product
app.put('/api/admin/products/:id', requireAdmin, upload.single('productImage'), (req, res) => {
  const products = readProducts()
  const idx      = products.findIndex(p => p.id === req.params.id)
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
  } = req.body ?? {}

  // If a new image was uploaded, delete the old uploaded file (if any)
  if (req.file && existing.image) {
    deleteUploadedImage(existing.image)
  }

  products[idx] = {
    ...existing,
    name:           productName           ? String(productName).slice(0, 200)           : existing.name,
    category:       productCategory       ? String(productCategory).slice(0, 50)        : existing.category,
    price:          productPrice !== undefined ? parseFloat(productPrice)               : existing.price,
    description:    productDescription    ? String(productDescription).slice(0, 2000)   : existing.description,
    additionalInfo: productAdditionalInfo ? String(productAdditionalInfo).slice(0, 1000): existing.additionalInfo,
    type:           productType           ? String(productType).slice(0, 100)           : existing.type,
    specs:          productSpecs
      ? String(productSpecs).split('\n').map(s => s.trim()).filter(Boolean)
      : existing.specs,
    image:          req.file ? req.file.filename : existing.image,
    updatedAt:      new Date().toISOString(),
  }

  writeProducts(products)
  res.json(products[idx])
})

// Delete product
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const products = readProducts()
  const idx      = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Product not found' })

  const [removed] = products.splice(idx, 1)
  deleteUploadedImage(removed.image)

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
