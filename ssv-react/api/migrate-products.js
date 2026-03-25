// Migration script: Import old products from products.json to MongoDB
require('dotenv').config()
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvjewellers'

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  additionalInfo: String,
  type: String,
  specs: [String],
  image: String,
  imageId: String,
  createdAt: Date,
  updatedAt: Date,
})
const Product = mongoose.model('Product', productSchema)

async function migrate() {
  await mongoose.connect(MONGODB_URI)
  const file = path.join(__dirname, 'data', 'products.json')
  const raw = fs.readFileSync(file, 'utf8')
  const products = JSON.parse(raw)
  for (const p of products) {
    // Remove id field, let MongoDB generate _id
    const { id, ...rest } = p
    await Product.updateOne(
      { name: rest.name, createdAt: rest.createdAt },
      { $set: rest },
      { upsert: true }
    )
    console.log('Migrated:', rest.name)
  }
  await mongoose.disconnect()
  console.log('Migration complete.')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
