import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import { apiUrl } from '../lib/api'
import styles from './Products.module.css'


/*
  Notes:
  - Added a section hero image and a responsive grid of 50 thumbnails (repeating
    `public/picture/section-one.jpeg`) to aid visual layout testing.
  - Thumbnails are lazy-loaded and styled via `Products.module.css`.
  - If you want unique images, replace the src paths in the gallery block.
*/



const CATEGORIES = ['all', 'ring', 'necklace', 'chain', 'bracelet', 'earring']

export default function Products() {
  console.log('Products component render start')
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const catBarRef = useRef(null)

  const searchQuery = searchParams.get('search') || ''

  const handleCatScroll = useCallback(() => {
    const el = catBarRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 4)
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  const scrollCat = useCallback((dir) => {
    const el = catBarRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 140 : -140, behavior: 'smooth' })
  }, [])

  // Always fetch from API, never use static products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetch(apiUrl('/api/products'))
        if (!res.ok) throw new Error('API unavailable')
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  /* Apply category + search filter */
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [products, activeCategory, searchQuery])

  function clearSearch() {
    setSearchParams({})
  }

  return (
    <>
      <Helmet>
        <title>Jewellery Collections | SSV Jewellers</title>
        <meta name="description" content="Explore our curated collection of gold, silver and diamond jewellery at SSV Jewellers." />
        <meta property="og:title" content="Jewellery Collections | SSV Jewellers" />
        <link rel="canonical" href="https://ssvjewellers.com/products" />
      </Helmet>

      <motion.div className={styles.content} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
        {/* Category Filter Bar */}
        <div className={styles.catBarWrapper}>
          {showLeftArrow && (
            <button
              className={`${styles.catScrollBtn} ${styles.catScrollLeft}`}
              onClick={() => scrollCat('left')}
              aria-label="Scroll categories left"
            >
              &#8249;
            </button>
          )}
          <div
            className={styles.categoryBar}
            ref={catBarRef}
            onScroll={handleCatScroll}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catItem}${activeCategory === cat ? ` ${styles.catActive}` : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <div className={styles.catIconWrap}>
                  <img src="/slides/pictures/logo.jpeg" alt={cat} loading="lazy" />
                </div>
                <span className={styles.catLabel}>{cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}</span>
              </button>
            ))}
          </div>
          {showRightArrow && (
            <button
              className={`${styles.catScrollBtn} ${styles.catScrollRight}`}
              onClick={() => scrollCat('right')}
              aria-label="Scroll categories right"
            >
              &#8250;
            </button>
          )}
        </div>

        {/* mobile dropdown removed — filter handled via category bar */}

        {/* Section hero image */}
        <div className={styles.sectionImageWrap}>
          <img src="/picture/section-one.jpeg" alt="Jewellery collection" className={styles.sectionImage} loading="lazy" />
        </div>

        {/* Gallery of 50 thumbnails (repeating the same image) */}
        <div className={styles.sectionImageGrid}>
          {Array.from({ length: 50 }).map((_, idx) => (
            <div key={`sec-img-${idx}`} className={styles.sectionImageItem}>
              <img src="/picture/section-one.jpeg" alt={`gallery ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </div>

        <motion.div className={styles.textBg} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          <h2>Our Jewellery Collections</h2>
          <p>Explore a curated selection of jewellery designed to complement every style and occasion.</p>
          {searchQuery && (
            <p className={styles.searchNote}>
              Showing results for: <strong>"{searchQuery}"</strong>
              <button className={styles.clearSearch} onClick={clearSearch}>✕ Clear</button>
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className={styles.loadingWrap}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <p className={styles.noResults}>No products found. Try a different filter.</p>
        ) : (
          <motion.div className={styles.productsGrid} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
            {filtered.map(product => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                  overlayStyle={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
