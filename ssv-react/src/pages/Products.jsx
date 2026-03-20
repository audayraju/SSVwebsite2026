import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import styles from './Products.module.css'

/* ── Static seed products (replaced by API data in production) ── */
const SEED_PRODUCTS = [
  { id: 1, name: 'Radha Krishna Haram', category: 'necklace', sku: 'SSV-HRM-001', price: '₹ 1,89,000', product_image: '/slides/pictures/logo.jpeg', description: 'Traditional temple haram with intricate Radha Krishna motif work.', specs: ['22K Gold', 'Approx. 52 g', 'Temple Craft Detailing', 'Handcrafted Finish'], extra: 'Hallmark certified. Customisation available on request.' },
  { id: 2, name: 'Classic Diamond Ring', category: 'ring', sku: 'SSV-RNG-002', price: '₹ 75,000', product_image: '/slides/pictures/logo.jpeg', description: 'Brilliant-cut solitaire diamond ring set in 18K white gold.', specs: ['18K White Gold', '0.5 ct Diamond', 'GIA Certified', 'VS1 Clarity'], extra: '' },
  { id: 3, name: 'Sterling Silver Bracelet', category: 'bracelet', sku: 'SSV-BRC-003', price: '₹ 12,500', product_image: '/slides/pictures/logo.jpeg', description: '925 sterling silver bracelet with contemporary leaf motif.', specs: ['925 Sterling Silver', '20 cm length', 'Polished Finish'], extra: 'Available in custom sizes.' },
  { id: 4, name: 'Gold Chain Necklace', category: 'chain', sku: 'SSV-CHN-004', price: '₹ 55,000', product_image: '/slides/pictures/logo.jpeg', description: '22K gold rope chain, durable and lightweight for daily wear.', specs: ['22K Gold', '45 cm', 'Rope Design'], extra: '' },
  { id: 5, name: 'Pearl Drop Earrings', category: 'earring', sku: 'SSV-ERR-005', price: '₹ 22,000', product_image: '/slides/pictures/logo.jpeg', description: 'South-sea pearl earrings with 18K gold setting.', specs: ['18K Gold', 'South-sea Pearl', 'Push-back Closure'], extra: '' },
  { id: 6, name: 'Kundan Necklace Set', category: 'necklace', sku: 'SSV-KND-006', price: '₹ 98,000', product_image: '/slides/pictures/logo.jpeg', description: 'Exquisite Kundan necklace set with matching earrings.', specs: ['22K Gold', 'Kundan Work', 'Meenakari Back'], extra: 'Comes in velvet box.' },
  { id: 7, name: 'Sapphire Ring', category: 'ring', sku: 'SSV-RNG-007', price: '₹ 45,000', product_image: '/slides/pictures/logo.jpeg', description: 'Natural blue sapphire ring set in 18K yellow gold.', specs: ['18K Gold', 'Natural Sapphire', 'GIA Certified'], extra: '' },
  { id: 8, name: 'Gold Bangle Set', category: 'bracelet', sku: 'SSV-BNG-008', price: '₹ 1,20,000', product_image: '/slides/pictures/logo.jpeg', description: 'Set of 6 plain gold bangles, hallmark certified.', specs: ['22K Gold', 'Set of 6', 'Hallmark Certified'], extra: '' },
]

const CATEGORIES = ['all', 'ring', 'necklace', 'chain', 'bracelet', 'earring']

export default function Products() {
  console.log('Products component render start')
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState(SEED_PRODUCTS)
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

  /* Fetch from API if available */
  useEffect(() => {
    console.log('Products: useEffect loadProducts start')
    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('API unavailable')
        const data = await res.json()
        if (Array.isArray(data) && data.length) setProducts(data)
      } catch {
        /* fall back to seed products silently */
      } finally {
        setLoading(false)
        console.log('Products: useEffect loadProducts finished, products count=', products.length)
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

      <div className={styles.content}>
        <div className={styles.textBg}>
          <h2>Our Jewellery Collections</h2>
          <p>Explore a curated selection of jewellery designed to complement every style and occasion.</p>
          {searchQuery && (
            <p className={styles.searchNote}>
              Showing results for: <strong>"{searchQuery}"</strong>
              <button className={styles.clearSearch} onClick={clearSearch}>✕ Clear</button>
            </p>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingWrap}>
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <p className={styles.noResults}>No products found. Try a different filter.</p>
        ) : (
          <div className={styles.productsGrid}>
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

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
