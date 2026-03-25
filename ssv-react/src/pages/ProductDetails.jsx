import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import ImageGallery from '../components/ImageGallery'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import { apiUrl } from '../lib/api'
import styles from './ProductDetails.module.css'

/* Same seed as Products.jsx – in production this comes from API */
const SEED_PRODUCTS = [
  { id: 1, name: 'Radha Krishna Haram', category: 'necklace', sku: 'SSV-HRM-001', price: '₹ 1,89,000', product_image: '/slides/pictures/logo.jpeg', description: 'Traditional temple haram with intricate Radha Krishna motif work, handcrafted for bridal and festive wear.', specs: ['22K Gold', 'Approx. 52 g', 'Temple Craft Detailing', 'Handcrafted Finish'], extra: 'Hallmark certified. Customisation available on request.' },
  { id: 2, name: 'Classic Diamond Ring', category: 'ring', sku: 'SSV-RNG-002', price: '₹ 75,000', product_image: '/slides/pictures/logo.jpeg', description: 'Brilliant-cut solitaire diamond ring set in 18K white gold.', specs: ['18K White Gold', '0.5 ct Diamond', 'GIA Certified', 'VS1 Clarity'], extra: '' },
  { id: 3, name: 'Sterling Silver Bracelet', category: 'bracelet', sku: 'SSV-BRC-003', price: '₹ 12,500', product_image: '/slides/pictures/logo.jpeg', description: '925 sterling silver bracelet with contemporary leaf motif.', specs: ['925 Sterling Silver', '20 cm length', 'Polished Finish'], extra: 'Available in custom sizes.' },
  { id: 4, name: 'Gold Chain Necklace', category: 'chain', sku: 'SSV-CHN-004', price: '₹ 55,000', product_image: '/slides/pictures/logo.jpeg', description: '22K gold rope chain, durable and lightweight for daily wear.', specs: ['22K Gold', '45 cm', 'Rope Design'], extra: '' },
  { id: 5, name: 'Pearl Drop Earrings', category: 'earring', sku: 'SSV-ERR-005', price: '₹ 22,000', product_image: '/slides/pictures/logo.jpeg', description: 'South-sea pearl earrings with 18K gold setting.', specs: ['18K Gold', 'South-sea Pearl', 'Push-back Closure'], extra: '' },
  { id: 6, name: 'Kundan Necklace Set', category: 'necklace', sku: 'SSV-KND-006', price: '₹ 98,000', product_image: '/slides/pictures/logo.jpeg', description: 'Exquisite Kundan necklace set with matching earrings.', specs: ['22K Gold', 'Kundan Work', 'Meenakari Back'], extra: 'Comes in velvet box.' },
  { id: 7, name: 'Sapphire Ring', category: 'ring', sku: 'SSV-RNG-007', price: '₹ 45,000', product_image: '/slides/pictures/logo.jpeg', description: 'Natural blue sapphire ring set in 18K yellow gold.', specs: ['18K Gold', 'Natural Sapphire', 'GIA Certified'], extra: '' },
  { id: 8, name: 'Gold Bangle Set', category: 'bracelet', sku: 'SSV-BNG-008', price: '₹ 1,20,000', product_image: '/slides/pictures/logo.jpeg', description: 'Set of 6 plain gold bangles, hallmark certified.', specs: ['22K Gold', 'Set of 6', 'Hallmark Certified'], extra: '' },
]

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`))
        if (!res.ok) throw new Error()
        const data = await res.json()
        setProduct(data)
      } catch {
        const found = SEED_PRODUCTS.find(p => String(p.id) === String(id))
        setProduct(found || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  if (!product) return (
    <div className={styles.notFound}>
      <h2>Product not found</h2>
      <Link to="/products" className={styles.backBtn} aria-label="Back to collections" title="Back to collections">
        <svg className={styles.backIcon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M11.75 4.75 6.5 10l5.25 5.25" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )

  const _img = product.image || product.product_image
  const imgSrc = _img
    ? (_img.startsWith('http') || _img.startsWith('data:') ? _img : `/uploads/${_img}`)
    : '/slides/pictures/logo.jpeg'

  const images = [imgSrc]
  const waMsg = encodeURIComponent(`Hi, I'm interested in ${product.name} (${product.sku || ''}). Could you give more details?`)
  const waLink = `https://wa.me/916281049201?text=${waMsg}`

  return (
    <>
      <Helmet>
        <title>{product.name} | SSV Jewellers</title>
        <meta name="description" content={product.description || `${product.name} – SSV Jewellers luxury jewellery collection.`} />
        <meta property="og:title" content={`${product.name} | SSV Jewellers`} />
        <meta property="og:image" content={imgSrc} />
        <link rel="canonical" href={`https://ssvjewellers.com/products/${id}`} />
      </Helmet>

      <motion.div className={styles.wrapper} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
        <Link to="/products" className={styles.backBtn} aria-label="Back to collections" title="Back to collections">
          <svg className={styles.backIcon} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M11.75 4.75 6.5 10l5.25 5.25" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <motion.div className={styles.layout} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          {/* Gallery */}
          <motion.div className={styles.galleryCol} variants={fadeUp}>
            <ImageGallery images={images} alt={product.name} />
          </motion.div>

          {/* Info */}
          <motion.div className={styles.infoCol} variants={fadeUp}>
            <span className={styles.badge}>{product.category}</span>
            <h1 className={styles.title}>{product.name}</h1>
            {product.sku && <p className={styles.sku}>{product.sku}</p>}
            {product.imageId && <p className={styles.sku}>Image ID: {product.imageId}</p>}
            {product.price && <p className={styles.price}>{product.price}</p>}

            <p className={styles.desc}>{product.description}</p>

            {product.specs && product.specs.length > 0 && (
              <div className={styles.specBox}>
                <h3>Specifications</h3>
                <ul>
                  {(Array.isArray(product.specs) ? product.specs : product.specs.split('|')).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.extra && (
              <div className={styles.extra}>
                <p>{product.extra}</p>
              </div>
            )}

            <a href={waLink} className={styles.waBtn} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp" aria-hidden="true" /> Enquire on WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}
