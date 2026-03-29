import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import styles from './Home.module.css'

/* ── CAROUSEL DATA ── */
const SLIDES = [
  {
    img: '/picture/hero-generated/hero_silver.png',
    alt: 'Silver Jewellery Collection',
    label: 'Silver Jewellery Collection',
    title: 'Trendy Silver Designs',
    slogan: 'Premium Quality Finish | Very Low Making Charges',
    desc: 'Visit our store today and find the perfect silver bridal set that completes your wedding look.',
    footer: 'BEST SHINE. BEST PRICE.',
    link: '/products?category=Silver',
  },
  {
    img: '/picture/hero-generated/hero_gold.png',
    alt: 'Gold Jewellery Collection',
    label: 'Sri Shakthi Vinayaka Jewellers',
    title: 'Gold Jewellery',
    slogan: 'All Types of Gold & Silver Orders Accepted',
    subSlogan: 'Silver Jewellery | Gems Jewellery',
    offers: 'Gold Orders: 8%- 9% Wastage | Zero Making Charges',
    link: '/products?category=Gold',
  },
  {
    img: '/picture/hero-generated/hero_bridal.png',
    alt: 'Bridal Gold Collection',
    label: 'Special Bridal Offer',
    title: 'Your dream bridal look starts with the perfect jewellery',
    slogan: '8% VA On Gold Ornaments | No Making Charges',
    desc: 'Make your wedding moments even more special with timeless Gold Designs crafted for modern brides.',
    link: '/products?category=Gold&search=bridal',
  },
]

/* ── SHOP BY CATEGORY ── */
const MAIN_CATEGORIES = [
  { title: 'Gold', link: '/products?category=Gold', img: '/picture/section-one.jpeg', desc: '916 Hallmark Purity' },
  { title: 'Diamonds', link: '/products?category=Diamonds', img: '/picture/section-twoo.jpeg', desc: 'Certified Brilliance' },
  { title: 'Silver', link: '/products?category=Silver', img: '/picture/section-three.jpeg', desc: 'Handcrafted Artistry' },
]

/* ── THE SSV PROMISE ── */
const PROMISES = [
  { id: 'heritage', title: 'Generations of Trust', desc: 'Crafting excellence for over decades in Hyderabad.', icon: '🏆' },
  { id: 'purity', title: '100% Purity', desc: 'BUREAU OF INDIAN STANDARDS (BIS) Hallmark certified Gold.', icon: '✨' },
  { id: 'design', title: 'Unique Designs', desc: 'Handpicked and custom creations for every taste.', icon: '💎' },
]

/* ── PRODUCT COLLECTIONS ── */
const GOLD_COLLECTION = [
  { title: 'Grand Necklaces', link: '/products?category=Necklaces&search=gold', img: '/picture/section-one.jpeg' },
  { title: 'Handcrafted Bangles', link: '/products?category=Bangles&search=gold', img: '/picture/section-twoo.jpeg' },
  { title: 'Bridal Harams', link: '/products?category=Necklaces&search=Haram', img: '/picture/section-three.jpeg' },
  { title: 'Designer Chokers', link: '/products?category=Chokers', img: '/picture/section-one.jpeg' },
  { title: 'Vintage Rings', link: '/products?category=Rings&search=gold', img: '/picture/section-twoo.jpeg' },
]

const SILVER_COLLECTION = [
  { title: 'Silver Articles', link: '/products?category=Silver&search=article', img: '/picture/section-one.jpeg' },
  { title: 'Modern Jewellery', link: '/products?category=Silver', img: '/picture/section-three.jpeg' },
  { title: 'Gift Sets', link: '/products?category=Gifts', img: '/picture/section-twoo.jpeg' },
  { title: 'Pooja Essentials', link: '/products?category=Pooja', img: '/picture/section-one.jpeg' },
  { title: 'Silver Coins', link: '/products?category=Silver&search=coin', img: '/picture/section-three.jpeg' },
]

const DIAMOND_COLLECTION = [
  { title: 'Prestige Rings', link: '/products?category=Rings&search=diamond', img: '/picture/section-twoo.jpeg' },
  { title: 'Royal Necklaces', link: '/products?category=Necklaces&search=diamond', img: '/picture/section-one.jpeg' },
  { title: 'Solitaire Pendants', link: '/products?category=Pendants&search=diamond', img: '/picture/section-three.jpeg' },
  { title: 'Diamond Studs', link: '/products?category=Earrings&search=diamond', img: '/picture/section-one.jpeg' },
  { title: 'Wedding Sets', link: '/products?category=Sets&search=diamond', img: '/picture/section-twoo.jpeg' },
]

/* ── SUB-COMPONENT: COLLECTION CAROUSEL ── */
function CollectionCarousel({ title, items, activeIdx, next, prev, windowWidth }) {
  return (
    <section className={styles.productsSection} aria-label={`${title} collection`}>
      <div className={styles.sectionHeader}>
        <div className={styles.luxuryHeader}>
          <span className={styles.luxuryLine}></span>
          <span className={styles.luxuryTitle}>{title}</span>
          <span className={styles.luxuryLine}></span>
        </div>
      </div>

      {windowWidth > 768 ? (
        <div className={styles.collectionCarousel}>
          <div className={styles.collectionViewport}>
            <motion.div 
              className={styles.collectionTrack}
              animate={{ x: `-${activeIdx * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {items.map((p, i) => (
                <div key={i} className={styles.collectionSlide}>
                  <div className={styles.productCard}>
                    <Link to={p.link} className={styles.productCardLink}>
                      <img src={p.img} alt={p.title} loading="lazy" />
                      <div className={styles.overlay}>
                        <h3>{p.title}</h3>
                        <span className={styles.viewLink}>View Collection →</span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          <button className={`${styles.collectionControl} ${styles.collectionPrev}`} onClick={prev}>‹</button>
          <button className={`${styles.collectionControl} ${styles.collectionNext}`} onClick={next}>›</button>
        </div>
      ) : (
        <motion.div
          className={styles.homeProductGrid}
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          {items.map((p, i) => (
            <motion.div key={i} className={styles.productCard} variants={fadeUp}>
              <Link to={p.link} className={styles.productCardLink}>
                <img src={p.img} alt={p.title} loading="lazy" />
                <div className={styles.overlay}>
                  <h3>{p.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeGoldSlide, setActiveGoldSlide] = useState(0)
  const [activeSilverSlide, setActiveSilverSlide] = useState(0)
  const [activeDiamondSlide, setActiveDiamondSlide] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const timerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* Auto-advance Hero Carousel */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, 8000)
    return () => clearInterval(timerRef.current)
  }, [])

  const prev = useCallback(() => setActiveSlide(s => (s - 1 + SLIDES.length) % SLIDES.length), [])
  const next = useCallback(() => setActiveSlide(s => (s + 1) % SLIDES.length), [])

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
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSlide}
              className={styles.heroSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img src={currentSlide.img} alt={currentSlide.alt} className={styles.heroImage} />
              <div className={styles.heroOverlay}>
                <motion.div 
                  className={styles.heroContent}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <span className={styles.heroLabel}>{currentSlide.label}</span>
                  <h1 className={styles.heroTitle}>{currentSlide.title}</h1>
                  
                  {currentSlide.slogan && <p className={styles.heroSlogan}>{currentSlide.slogan}</p>}
                  {currentSlide.subSlogan && <p className={styles.heroSubSlogan}>{currentSlide.subSlogan}</p>}
                  {currentSlide.offers && <div className={styles.heroOffers}>{currentSlide.offers}</div>}
                  {currentSlide.desc && <p className={styles.heroDesc}>{currentSlide.desc}</p>}
                  {currentSlide.footer && <div className={styles.heroFooterText}>{currentSlide.footer}</div>}
                  
                  <div className={styles.heroActions}>
                    <Link to={currentSlide.link} className={styles.luxuryButton}>
                      Explore Collection
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className={styles.heroControls}>
            <button onClick={prev} className={styles.heroArrow}>‹</button>
            <div className={styles.heroDots}>
              {SLIDES.map((_, i) => (
                <button 
                  key={i} 
                  className={`${styles.heroDot} ${i === activeSlide ? styles.heroDotActive : ''}`}
                  onClick={() => setActiveSlide(i)}
                />
              ))}
            </div>
            <button onClick={next} className={styles.heroArrow}>›</button>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className={styles.categoriesSection}>
        <div className={styles.luxuryHeader}>
          <span className={styles.luxuryLine}></span>
          <span className={styles.luxuryTitle}>Shop By Category</span>
          <span className={styles.luxuryLine}></span>
        </div>
        <div className={styles.categoryGrid}>
          {MAIN_CATEGORIES.map((cat, i) => (
            <Link to={cat.link} key={i} className={styles.categoryCard}>
              <div className={styles.categoryImageWrap}>
                <img src={cat.img} alt={cat.title} />
                <div className={styles.categoryOverlay}>
                  <h2>{cat.title}</h2>
                  <span>{cat.desc}</span>
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

      {/* ── COLLECTIONS ── */}
      <CollectionCarousel 
        title="Gold Collection" 
        items={GOLD_COLLECTION} 
        activeIdx={activeGoldSlide}
        next={() => setActiveGoldSlide(s => (s + 1) % GOLD_COLLECTION.length)}
        prev={() => setActiveGoldSlide(s => (s - 1 + GOLD_COLLECTION.length) % GOLD_COLLECTION.length)}
        windowWidth={windowWidth}
      />

      <CollectionCarousel 
        title="Silver Collection" 
        items={SILVER_COLLECTION} 
        activeIdx={activeSilverSlide}
        next={() => setActiveSilverSlide(s => (s + 1) % SILVER_COLLECTION.length)}
        prev={() => setActiveSilverSlide(s => (s - 1 + SILVER_COLLECTION.length) % SILVER_COLLECTION.length)}
        windowWidth={windowWidth}
      />

      <CollectionCarousel 
        title="Diamond Boutique" 
        items={DIAMOND_COLLECTION} 
        activeIdx={activeDiamondSlide}
        next={() => setActiveDiamondSlide(s => (s + 1) % DIAMOND_COLLECTION.length)}
        prev={() => setActiveDiamondSlide(s => (s - 1 + DIAMOND_COLLECTION.length) % DIAMOND_COLLECTION.length)}
        windowWidth={windowWidth}
      />

      {/* ── BRAND STORY ── */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          <div className={styles.storyImage}>
            <img src="/picture/section-three.jpeg" alt="Craftsmanship" />
          </div>
          <div className={styles.storyContent}>
            <div className={styles.luxuryHeader} style={{ justifyContent: 'flex-start' }}>
              <span className={styles.luxuryTitle} style={{ padding: 0 }}>Our Heritage</span>
              <span className={styles.luxuryLine} style={{ maxWidth: '60px' }}></span>
            </div>
            <h2>A Legacy of Pure Artistry</h2>
            <p>
              Since our inception, SSV Jewellers has been synonymous with trust and quality. 
              Every piece in our collection is a testament to our commitment to excellence, 
              blending traditional craftsmanship with modern design sensibilities.
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
