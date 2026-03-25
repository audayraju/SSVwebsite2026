
// Migration script: Import old products from products.json to MongoDB, upload images to Cloudinary
require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvjewellers'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

async function generateImageId() {
  const last = await Product.findOne().sort({ imageId: -1 })
  let num = 1
  if (last && last.imageId) {
    const match = last.imageId.match(/IMG-(\d+)/)
    if (match) num = parseInt(match[1], 10) + 1
  }
  return `IMG-${String(num).padStart(6, '0')}`
}

async function migrate() {
  await mongoose.connect(MONGODB_URI)
  const file = path.join(__dirname, 'data', 'products.json')
  const raw = fs.readFileSync(file, 'utf8')
  const products = JSON.parse(raw)
  for (const p of products) {
    // Remove id field, let MongoDB generate _id
    const { id, image, specs, specifications, additionalInfo, additionalInformation, ...rest } = p

    // Upload image to Cloudinary if file exists
    let imageUrl = '', imagePublicId = ''
    if (image && typeof image === 'string' && image.trim()) {
      const imgPath = path.join(__dirname, '..', 'picture', image)
      if (fs.existsSync(imgPath)) {
        try {
          const uploadRes = await cloudinary.uploader.upload(imgPath, { folder: 'products' })
          imageUrl = uploadRes.secure_url
          imagePublicId = uploadRes.public_id
        } catch (e) {
          console.warn('Cloudinary upload failed:', imgPath, e.message)
        }
      } else {
        console.warn('Image file not found:', imgPath)
      }
    }

    // Auto-generate imageId if not present
    let imageId = p.imageId
    if (!imageId) imageId = await generateImageId()

    // Convert specifications (multi-line string to array)
    let specsArr = []
    const specSource = specifications || specs || ''
    if (Array.isArray(specSource)) {
      specsArr = specSource.map(s => String(s).trim()).filter(Boolean)
    } else if (typeof specSource === 'string') {
      specsArr = specSource.split('\n').map(s => s.trim()).filter(Boolean)
    }

    // Use additionalInformation field
    const addInfo = additionalInformation || additionalInfo || ''

    // Compose product doc
    const doc = {
      ...rest,
      name: String(p.name || '').trim(),
      imageUrl,
      imagePublicId,
      imageId,
      category: String(p.category || '').trim(),
      price: Number(p.price) || 0,
      description: p.description || '',
      additionalInformation: addInfo,
      type: p.type || '',
      specifications: specsArr,
      createdAt: p.createdAt || new Date(),
      updatedAt: p.updatedAt || new Date(),
    }

    await Product.updateOne(
      { name: doc.name, createdAt: doc.createdAt },
      { $set: doc },
      { upsert: true }
    )
    console.log('Migrated:', doc.name)
  }
  await mongoose.disconnect()
  console.log('Migration complete.')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
