/**
 * Fast Cloudinary Migration
 * Uploads images in parallel and updates productData.js
 */

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp']
const PUBLIC_PATH = path.join(__dirname, '..', 'public')
const PRODUCT_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'productData.js')

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase().slice(1)
  return ALLOWED_FORMATS.includes(ext)
}

async function findAllImages() {
  const images = {}
  const imagesPath = path.join(PUBLIC_PATH, 'images')

  if (!fs.existsSync(imagesPath)) {
    console.log('⚠️  public/images not found')
    return images
  }

  const folders = fs.readdirSync(imagesPath)

  for (const folder of folders) {
    const folderPath = path.join(imagesPath, folder)
    const stat = fs.statSync(folderPath)

    if (!stat.isDirectory()) continue

    const files = fs.readdirSync(folderPath)
    const folderImages = []

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isFile() && isImageFile(filePath)) {
        const localPath = `/images/${folder}/${file}`
        folderImages.push({
          localPath,
          filename: file,
          folder,
          fullPath: filePath,
          cloudinaryUrl: null,
        })
      }
    }

    if (folderImages.length > 0) {
      images[folder] = folderImages
    }
  }

  return images
}

async function uploadToCloudinary(imagePath, folder) {
  try {
    const uploadRes = await cloudinary.uploader.upload(imagePath, {
      folder: `ssv-jewellers/${folder}`,
      overwrite: true,
      resource_type: 'auto',
    })

    return {
      success: true,
      cloudinaryUrl: uploadRes.secure_url,
    }
  } catch (error) {
    console.error(`❌ ${path.basename(imagePath)}: ${error.message}`)
    return { success: false }
  }
}

async function uploadAllImages() {
  console.log('🚀 Scanning and uploading images to Cloudinary...\n')

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error('❌ Cloudinary credentials not found in .env')
    process.exit(1)
  }

  const allImages = await findAllImages()

  let totalImages = 0
  for (const images of Object.values(allImages)) {
    totalImages += images.length
  }

  console.log(`✅ Found ${totalImages} images\n`)

  if (totalImages === 0) {
    console.log('⚠️  No images to upload')
    return {}
  }

  let uploadedCount = 0
  const urlMapping = {}

  // Upload images in parallel (10 at a time)
  for (const [folder, images] of Object.entries(allImages)) {
    urlMapping[folder] = {}
    console.log(`📁 ${folder} (${images.length} images)`)

    // Process in batches of 10 for parallel uploads
    for (let i = 0; i < images.length; i += 10) {
      const batch = images.slice(i, i + 10)
      const uploadPromises = batch.map(img =>
        uploadToCloudinary(img.fullPath, folder).then(result => {
          if (result.success) {
            urlMapping[folder][img.localPath] = result.cloudinaryUrl
            uploadedCount++
            process.stdout.write('.')
          }
          return result
        })
      )
      await Promise.all(uploadPromises)
    }
    console.log('')
  }

  // Save mapping
  const mappingFile = path.join(__dirname, 'cloudinary-url-mapping.json')
  fs.writeFileSync(mappingFile, JSON.stringify(urlMapping, null, 2))

  console.log(`\n📊 Upload Summary:`)
  console.log(`   Total: ${totalImages}`)
  console.log(`   ✅ Uploaded: ${uploadedCount}`)
  console.log(`   ❌ Failed: ${totalImages - uploadedCount}`)
  console.log(`\n💾 Saved mapping to: api/cloudinary-url-mapping.json`)

  return urlMapping
}

async function updateProductData(urlMapping) {
  console.log('\n🔄 Updating productData.js...')

  if (!fs.existsSync(PRODUCT_DATA_PATH)) {
    console.error('❌ productData.js not found')
    return false
  }

  let content = fs.readFileSync(PRODUCT_DATA_PATH, 'utf8')
  let updateCount = 0

  // Replace all image paths
  for (const [folder, pathMapping] of Object.entries(urlMapping)) {
    for (const [oldPath, newUrl] of Object.entries(pathMapping)) {
      // Match: image: '/images/...' or image: "/images/..."
      const escapedPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`image:\\s*['"]${escapedPath}['"]`, 'g')

      if (regex.test(content)) {
        content = content.replace(regex, `image: '${newUrl}'`)
        updateCount++
      }
    }
  }

  if (updateCount > 0) {
    fs.writeFileSync(PRODUCT_DATA_PATH, content)
    console.log(`✅ Updated ${updateCount} image URLs\n`)
    return true
  } else {
    console.log('⚠️  No image URLs matched in productData.js\n')
    return false
  }
}

async function main() {
  try {
    const urlMapping = await uploadAllImages()

    if (Object.keys(urlMapping).length > 0) {
      await updateProductData(urlMapping)
      console.log('✨ Migration complete!\n')
      console.log('📝 Next steps:')
      console.log('   1. npm run build')
      console.log('   2. npm run preview (test locally)')
      console.log('   3. Images now load from Cloudinary CDN ⚡\n')
    }
  } catch (err) {
    console.error('Fatal error:', err)
    process.exit(1)
  }
}

main()
