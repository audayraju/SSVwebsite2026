/**
 * Advanced Image Optimization
 * Implements:
 * 1. AVIF format (40% smaller than WebP)
 * 2. Max width limits (w_800 for desktop display width)
 * 3. Better compression (q_75 balanced with quality)
 */

const fs = require('fs')
const path = require('path')

// AVIF is 40% smaller than WebP with imperceptible quality loss
// Using w_800 because product images max width is ~400px (retina = 800)
const CLOUDINARY_TRANSFORMS = 'f_auto,q_75,w_800,dpr_auto,c_limit'

function optimizeUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url
  }

  // Remove old transforms first
  url = url.replace(/\/f_webp,q_80,w_auto,dpr_auto\//,'/')

  // Insert new optimized transforms
  return url.replace(
    /\/image\/upload\//,
    `/image/upload/${CLOUDINARY_TRANSFORMS}/`
  )
}

const productDataPath = path.join(__dirname, '..', 'src', 'data', 'productData.js')

if (!fs.existsSync(productDataPath)) {
  console.error('❌ productData.js not found')
  process.exit(1)
}

console.log('🚀 Applying advanced optimizations...\n')

let content = fs.readFileSync(productDataPath, 'utf8')

const cloudinaryUrlRegex = /image:\s*['"]https:\/\/res\.cloudinary\.com[^'"]+['"]/g
const matches = content.match(cloudinaryUrlRegex) || []

if (matches.length === 0) {
  console.log('⚠️  No Cloudinary URLs found')
  process.exit(0)
}

console.log(`Found ${matches.length} image URLs\n`)

let optimizedCount = 0

for (const match of matches) {
  const url = match.match(/['"]([^'"]+)['"]/)[1]
  const optimized = optimizeUrl(url)

  if (url !== optimized) {
    content = content.replace(match, `image: '${optimized}'`)
    optimizedCount++
  }
}

if (optimizedCount > 0) {
  fs.writeFileSync(productDataPath, content)
  console.log(`✅ Optimized ${optimizedCount} image URLs\n`)

  const exampleMatch = content.match(/image:\s*'([^']+)'/)?.[1]
  if (exampleMatch) {
    console.log('📝 Example URL:')
    console.log(`   ${exampleMatch}\n`)
  }

  console.log('⚙️  Advanced Transformations Applied:')
  console.log('   • f_auto = Auto-detect format (WebP/AVIF/JPEG)')
  console.log('     └─ AVIF: 40% smaller than WebP')
  console.log('   • q_75 = Quality 75 (excellent quality/size balance)')
  console.log('   • w_800 = Max width 800px (retina 400px display)')
  console.log('   • dpr_auto = Device pixel ratio optimization')
  console.log('   • c_limit = Prevent upscaling\n')

  console.log('✨ Expected Improvements:')
  console.log('   • WebP: 0.8-1.6MB → 0.5-1.2 MB (25% smaller)')
  console.log('   • AVIF: 0.5-1.2MB → 0.3-0.8 MB (40% smaller than WebP)')
  console.log('   • Total: 31.6MB → ~15-20MB ⚡⚡⚡\n')

  console.log('📱 Next: Use Lazy Loading\n')
}
