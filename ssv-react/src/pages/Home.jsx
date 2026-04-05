import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import { products as productList } from '../data/productData'
import styles from './Home.module.css'

/* ── CAROUSEL DATA ── */
const SLIDES = [
  {
    img: '/picture/carousel-images/SSV_Ads_Banners-01.jpg.jpeg',
    alt: 'Luxury Gold Collection',
    label: 'Sri Shakthi Vinayaka',
    title: 'Luxury Gold Collection',
    desc: 'Explore our exquisite handcrafted gold designs made for every occasion.',
    link: '/products?category=Gold',
  },
  {
    img: '/picture/carousel-images/SSV_ Ads_Banners-02.jpg.jpeg',
    alt: 'Modern Silver Artistry',
    label: 'Pure Silver Art',
    title: 'Elegant Silver Collection',
    desc: 'Exquisite silver bridal sets and articles that complement your unique style.',
    link: '/products?category=Silver',
  },
  {
    img: '/picture/carousel-images/SSV_ Ads_Banners-03.jpg.jpeg',
    alt: 'Diamond Boutique',
    label: 'Certified Brilliance',
    title: 'Diamond Boutique',
    desc: 'Discover the sparkle of infinity with our certified diamond collection.',
    link: '/products?category=Diamonds',
  },
]

/* ── SHOP BY CATEGORY ── */
const MAIN_CATEGORIES = [
  {
    title: 'Gold Jewellery',
    link: '/products?category=Gold',
    img: '/picture/section-one.jpeg',
    desc: '916 Hallmark Purity',
    badge: 'BIS Hallmark',
    note: 'Bridal & Festive Collection',
    cta: 'Explore Gold →',
  },
  {
    title: 'Diamond Collection',
    link: '/products?category=Diamonds',
    img: '/picture/section-twoo.jpeg',
    desc: 'Certified Brilliance',
    badge: 'Certified Stones',
    note: 'Elegant Signature Designs',
    cta: 'Explore Diamonds →',
  },
  {
    title: '92.5 Silver Jewellery',
    link: '/products?category=Silver',
    img: '/picture/section-three.jpeg',
    desc: 'Handcrafted Artistry',
    badge: 'Trending Picks',
    note: 'Temple & Daily Wear Styles',
    cta: 'Explore Silver →',
  },
]



/* ── THE SSV PROMISE ── */
const PROMISES = [
  { id: 'heritage', title: 'Generations of Trust', desc: 'Crafting excellence for over decades in Hyderabad.', icon: '🏆' },
  { id: 'purity', title: '100% Purity', desc: 'BUREAU OF INDIAN STANDARDS (BIS) Hallmark certified Gold.', icon: '✨' },
  { id: 'design', title: 'Unique Designs', desc: 'Handpicked and custom creations for every taste.', icon: '💎' },
]

const TOP_GOLD_COLLECTION_IDS = ['19', '15', '60', '4', '20']
const TOP_GOLD_COLLECTION_PRODUCTS = TOP_GOLD_COLLECTION_IDS
  .map(id => productList.find(p => p.id === id))
  .filter(Boolean)

const TRENDING_SILVER_COLLECTION_IDS = ['5', '9', '13', '46', '39']
const TRENDING_SILVER_COLLECTION_PRODUCTS = TRENDING_SILVER_COLLECTION_IDS
  .map(id => productList.find(p => p.id === id))
  .filter(Boolean)

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)

  /* Auto-advance Hero Carousel */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [])

  const currentSlide = SLIDES[activeSlide]

  return (
    <div className={styles.homeWrapper}>
      <Helmet>
        <title>SSV Jewellers – Luxury Gold, Silver &amp; Diamond Boutique</title>
        <meta name="description" content="Discover exquisite handcrafted jewellery at SSV Jewellers. Gold collection from 8% wastage only." />
      </Helmet>

      {/* ── HERO SECTION ── */}
      <section className={styles.hero} aria-label="Featured Collection">
        <div className={styles.heroViewport}>
          <div className={styles.heroSlide}>
            <img src={currentSlide.img} alt={currentSlide.alt} className={styles.heroImage} loading="eager" decoding="async" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className={styles.categoriesSection}>
        <div className={styles.luxuryHeaderVertical}>
          <span className={styles.luxuryTitle}>Shop By Category</span>
          <p className={styles.categoryIntro}>Curated collections with authentic craftsmanship and standout styling.</p>
          <div className={styles.luxuryDivider}>
            <span className={styles.luxuryLine}></span>
            <span className={styles.luxuryStar}>✦</span>
            <span className={styles.luxuryLine}></span>
          </div>
        </div>
        <div className={styles.categoryGrid}>
          {MAIN_CATEGORIES.map((cat, i) => (
            <Link to={cat.link} key={i} className={styles.categoryCard}>
              <div className={styles.categoryImageWrap}>
                <img src={cat.img} alt={cat.title} loading="lazy" decoding="async" />
                <div className={styles.categoryOverlay}>
                  <span className={styles.categoryBadge}>{cat.badge}</span>
                  <h2>{cat.title}</h2>
                  <span>{cat.desc}</span>
                  <p className={styles.categoryNote}>{cat.note}</p>
                  <span className={styles.categoryAction}>{cat.cta}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── THE SSV PROMISE ── */}
      <section className={styles.promiseSection}>
        <div className={styles.promiseContainer}>
          {PROMISES.map((p) => (
            <motion.div
              key={p.id}
              className={styles.promiseItem}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              <span className={styles.promiseIcon}>{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Top Selling Jewellery Collection ── */}
      <section className={styles.productsSection} aria-label="Top Selling Jewellery Collection">
        <div className={styles.sectionHeader}>
          <div className={styles.luxuryHeader}>
            <span className={styles.luxuryLine}></span>
            <span className={styles.luxuryTitle}>Top Selling Jewellery Collection</span>
            <span className={styles.luxuryLine}></span>
          </div>
        </div>

        <div className={styles.topProductsGrid}>
          {TOP_GOLD_COLLECTION_PRODUCTS.map((product, index) => (
            <div key={product.id} className={styles.productCard}>
              <Link to={`/products/${product.id}`} className={styles.productCardLink}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
                <div className={styles.overlay}>
                  <h3>{product.name}</h3>
                  <span className={styles.viewLink}>View Details</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Silver Collection ── */}
      <section className={styles.productsSection} aria-label="Trending 92.5 Silver Jewellery">
        <div className={styles.sectionHeader}>
          <div className={styles.luxuryHeader}>
            <span className={styles.luxuryLine}></span>
            <span className={styles.luxuryTitle}>Trending 92.5 Silver Jewellery</span>
            <span className={styles.luxuryLine}></span>
          </div>
        </div>

        <div className={styles.topProductsGrid}>
          {TRENDING_SILVER_COLLECTION_PRODUCTS.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Link to={`/products/${product.id}`} className={styles.productCardLink}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <div className={styles.overlay}>
                  <h3>{product.name}</h3>
                  <span className={styles.viewLink}>View Details</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          <div className={styles.storyImage}>
            <img src="/images/bangles/bridal%20set.jpeg" alt="SSV Jewellers bridal jewellery set" loading="lazy" decoding="async" />
          </div>
          <div className={styles.storyContent}>
            <div className={styles.luxuryHeader} style={{ justifyContent: 'flex-start' }}>
              <span className={styles.luxuryTitle} style={{ padding: 0 }}>Our Heritage</span>
              <span className={styles.luxuryLine} style={{ maxWidth: '60px' }}></span>
            </div>
            <h2>Our Signature Bridal Set</h2>
            <p>
              This bridal set is one of the special highlights at SSV Jewellers, admired for its rich presence, detailed craftsmanship, and elegant bridal appeal.
              Designed to stand out on wedding occasions, it reflects the grandeur and finish that many of our customers look for in a main statement piece.
              If you are searching for a memorable bridal design in our store, this featured set is one of our proud special selections.
            </p>
            <Link to="/about" className={styles.outlineButton}>Discover Our Story</Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <h2>Ready to Find Your Perfect Piece?</h2>
          <p>Visit our boutique for a personalized experience or explore our digital catalog.</p>
          <div className={styles.ctaActions}>
            <Link to="/products" className={styles.luxuryButton}>Shop Collection</Link>
            <Link to="/contact" className={styles.outlineButtonLight}>Book Appointment</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
