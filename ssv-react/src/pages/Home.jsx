import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import { products as productList } from '../data/productData'
import styles from './Home.module.css'

/* ── CAROUSEL DATA ── */
const SLIDES = [

  {
    img: '/picture/carousel-images/SSV Thumnail-03.jpg.jpeg',
    alt: 'Modern Silver Artistry',
    label: 'Pure Silver Art',
    title: 'Elegant Silver Collection',
    desc: 'Exquisite silver bridal sets and articles that complement your unique style.',
    link: '/products?category=Silver',
  },
  {
    img: '/picture/carousel-images/SSV Thumnail 4.jpg.jpeg',
    alt: 'Diamond Boutique',
    label: 'Certified Brilliance',
    title: 'Diamond Boutique',
    desc: 'Discover the sparkle of infinity with our certified diamond collection.',
    link: '/products?category=Diamonds',
  },
  {
    img: '/picture/carousel-images/SSV Thumnail-04.jpg.jpeg',
    alt: 'Luxury Gold Collection',
    label: 'Sri Shakthi Vinayaka',
    title: 'Luxury Gold Collection',
    desc: 'Explore our exquisite handcrafted gold designs made for every occasion.',
    link: '/products?category=Gold',
  },
]







const PROMISES = [
  {
    id: 1,
    icon: '💍',
    title: 'Hallmarked Gold',
    desc: 'Every piece is BIS hallmarked for guaranteed purity and authenticity.',
  },
  {
    id: 2,
    icon: '✨',
    title: 'Master Craftsmanship',
    desc: 'Handcrafted by skilled artisans with generations of jewellery-making expertise.',
  },
  {
    id: 3,
    icon: '🚚',
    title: 'Free Insurance Shipping',
    desc: 'Completely insured delivery with tracking to ensure your jewellery arrives safely.',
  },
  {
    id: 4,
    icon: '🔄',
    title: 'Lifetime Exchange',
    desc: 'Lifetime exchange policy with value retention on all gold purchases.',
  },
]

const TOP_GOLD_COLLECTION_IDS = ['19', '15', '60', '4', '20']
const TOP_GOLD_COLLECTION_PRODUCTS = TOP_GOLD_COLLECTION_IDS
  .map(id => productList.find(p => p.id === id))
  .filter(Boolean)

const TRENDING_SILVER_COLLECTION_IDS = ['5', '9', '13', '46', '39']
const TRENDING_SILVER_COLLECTION_PRODUCTS = TRENDING_SILVER_COLLECTION_IDS
  .map(id => productList.find(p => p.id === id))
  .filter(Boolean)
const CONFETTI_COUNT = 350

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [goldMobileIndex, setGoldMobileIndex] = useState(0)
  const [silverMobileIndex, setSilverMobileIndex] = useState(0)
  const [isBridalImageOpen, setIsBridalImageOpen] = useState(false)
  const [isBridalInnerZoomed, setIsBridalInnerZoomed] = useState(false)
  const [bridalTransformOrigin, setBridalTransformOrigin] = useState('50% 50%')
  const [showConfetti, setShowConfetti] = useState(false)
  const [launchCountdown, setLaunchCountdown] = useState(null)
  const [isLaunchSectionVisible, setIsLaunchSectionVisible] = useState(true)
  const timerRef = useRef(null)
  const launchCountdownRef = useRef(null)
  const launchBlastHideRef = useRef(null)

  const closeBridalModal = () => {
    setIsBridalImageOpen(false)
    setIsBridalInnerZoomed(false)
    setBridalTransformOrigin('50% 50%')
  }

  const handleBridalImageClick = (event) => {
    event.stopPropagation()
  }

  const handleBridalDoubleTap = (event) => {
    event.stopPropagation()
    setIsBridalInnerZoomed(current => !current)

    if (!isBridalInnerZoomed) {
      const x = (event.clientX / window.innerWidth) * 100
      const y = (event.clientY / window.innerHeight) * 100
      setBridalTransformOrigin(`${x}% ${y}%`)
    } else {
      setBridalTransformOrigin('50% 50%')
    }
  }

  const handleBridalMouseMove = (event) => {
    if (!isBridalInnerZoomed) return
    const x = (event.clientX / window.innerWidth) * 100
    const y = (event.clientY / window.innerHeight) * 100
    setBridalTransformOrigin(`${x}% ${y}%`)
  }

  const handleBridalTouchMove = (event) => {
    if (!isBridalInnerZoomed || event.touches.length === 0) return
    const touch = event.touches[0]
    const x = (touch.clientX / window.innerWidth) * 100
    const y = (touch.clientY / window.innerHeight) * 100
    setBridalTransformOrigin(`${x}% ${y}%`)
  }

  const goPrev = (length, setter) => {
    setter(current => (current - 1 + length) % length)
  }

  const goNext = (length, setter) => {
    setter(current => (current + 1) % length)
  }

  const confettiPieces = useMemo(() => {
    const pieces = []
    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const baseX = Math.random() * window.innerWidth
      const isWide = Math.random() > 0.5
      const direction = Math.random()
      pieces.push({
        id: i,
        left: baseX,
        initialX: baseX,
        delay: (Math.random() * 0.5) * (Math.random() > 0.7 ? 0.8 : 1),
        duration: 1.5 + Math.random() * 1.2,
        color: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98', '#FF1493'][Math.floor(Math.random() * 6)],
        angle: (direction < 0.33 ? 20 + Math.random() * 40 : direction < 0.66 ? 90 + Math.random() * 30 : 140 + Math.random() * 40) * (Math.PI / 180),
        width: isWide ? (8 + Math.random() * 8) : (3 + Math.random() * 3),
        height: isWide ? (3 + Math.random() * 3) : (8 + Math.random() * 8),
      })
    }
    return pieces
  }, [showConfetti])

  const handleLaunchClick = () => {
    if (launchCountdown !== null || showConfetti) return

    setLaunchCountdown(5)

    launchCountdownRef.current = setInterval(() => {
      setLaunchCountdown((current) => {
        if (current === null) return null

        if (current <= 1) {
          clearInterval(launchCountdownRef.current)
          launchCountdownRef.current = null

          setShowConfetti(true)

          launchBlastHideRef.current = setTimeout(() => {
            setShowConfetti(false)
            setIsLaunchSectionVisible(false)
          }, 3000)

          return null
        }

        return current - 1
      })
    }, 1000)
  }

  /* Auto-advance Hero Carousel */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide(s => (s + 1) % SLIDES.length)
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [])

  /* Auto-advance Mobile Gold/Silver Carousels */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mobileMedia = window.matchMedia('(max-width: 600px)')
    let mobileAutoTimer = null

    const startOrStopAutoSlide = () => {
      if (mobileAutoTimer) {
        clearInterval(mobileAutoTimer)
        mobileAutoTimer = null
      }

      if (!mobileMedia.matches) return

      mobileAutoTimer = setInterval(() => {
        setGoldMobileIndex(current => (TOP_GOLD_COLLECTION_PRODUCTS.length ? (current + 1) % TOP_GOLD_COLLECTION_PRODUCTS.length : 0))
        setSilverMobileIndex(current => (TRENDING_SILVER_COLLECTION_PRODUCTS.length ? (current + 1) % TRENDING_SILVER_COLLECTION_PRODUCTS.length : 0))
      }, 3500)
    }

    startOrStopAutoSlide()

    if (mobileMedia.addEventListener) {
      mobileMedia.addEventListener('change', startOrStopAutoSlide)
    } else {
      mobileMedia.addListener(startOrStopAutoSlide)
    }

    return () => {
      if (mobileAutoTimer) clearInterval(mobileAutoTimer)

      if (mobileMedia.removeEventListener) {
        mobileMedia.removeEventListener('change', startOrStopAutoSlide)
      } else {
        mobileMedia.removeListener(startOrStopAutoSlide)
      }
    }
  }, [])

  useEffect(() => {
    if (!isBridalImageOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onEsc = (event) => {
      if (event.key === 'Escape') closeBridalModal()
    }

    window.addEventListener('keydown', onEsc)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onEsc)
    }
  }, [isBridalImageOpen])

  useEffect(() => {
    return () => {
      if (launchCountdownRef.current) clearInterval(launchCountdownRef.current)
      if (launchBlastHideRef.current) clearTimeout(launchBlastHideRef.current)
    }
  }, [])

  const currentSlide = SLIDES[activeSlide]

  return (
    <div className={styles.homeWrapper}>
      <Helmet>
        <title>SSV Jewellers – Luxury Gold, Silver &amp; Diamond Boutique</title>
        <meta name="description" content="Discover exquisite handcrafted jewellery at SSV Jewellers. Gold collection from 8% wastage only." />
      </Helmet>

      {isLaunchSectionVisible && (
        <>
          {/* ── LAUNCH CELEBRATION SECTION (LUXURY HERO) ── */}
          <section className={styles.launchSection}>
            <div className={styles.launchContainer}>
              <motion.div
                className={styles.launchContent}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={inViewViewport}
              >
                <p className={styles.launchLabel}>
                  <span className={styles.labelArrow} aria-hidden="true">⟵</span>
                  <span>Grand Opening</span>
                  <span className={styles.labelArrow} aria-hidden="true">⟶</span>
                </p>
                <h2 className={styles.launchTitle}>
                  <span className={styles.titleSparkle} aria-hidden="true">✦</span>
                  <span className={styles.titleText}>SSV Jewellers</span>
                  <span className={styles.titleSparkle} aria-hidden="true">✦</span>
                </h2>
                <p className={styles.launchSubtitle}>
                  Celebrate the launch of our handcrafted gold and sterling silver jewellery collection.
                </p>
                <button
                  onClick={handleLaunchClick}
                  className={`${styles.launchButton} ${launchCountdown !== null ? styles.launchButtonRound : ''}`}
                  aria-label={launchCountdown !== null ? `Countdown ${launchCountdown}` : 'Explore our jewellery collection'}
                  disabled={launchCountdown !== null || showConfetti}
                >
                  {launchCountdown !== null ? launchCountdown : 'Explore Collection →'}
                </button>
              </motion.div>

              {showConfetti && (
                <div className={styles.confettiContainer}>
                  {confettiPieces.map((piece) => {
                    const velocityX = Math.cos(piece.angle) * 250
                    const velocityY = Math.sin(piece.angle) * 350
                    const finalX = piece.initialX + velocityX
                    const finalY = window.innerHeight + 100
                    return (
                      <motion.div
                        key={piece.id}
                        className={styles.confettiPiece}
                        style={{
                          left: `${piece.left}px`,
                          backgroundColor: piece.color,
                          width: `${piece.width}px`,
                          height: `${piece.height}px`,
                        }}
                        initial={{ x: 0, y: -30, opacity: 1, rotate: 0 }}
                        animate={{
                          x: velocityX * 1.5,
                          y: finalY,
                          opacity: 0,
                          rotate: piece.id % 2 === 0 ? 720 : -720,
                        }}
                        transition={{
                          duration: piece.duration,
                          delay: piece.delay,
                          ease: 'easeInOut',
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── HERO SECTION ── */}
      <section className={styles.hero} aria-label="Featured Collection">
        <div className={styles.heroViewport}>
          <div className={styles.heroSlide}>
            <img src={currentSlide.img} alt={currentSlide.alt} className={styles.heroImage} loading="eager" decoding="async" fetchPriority="high" />
          </div>
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

        <div className={styles.mobileProductsCarousel}>
          <button
            type="button"
            className={styles.mobileNavBtn}
            aria-label="Previous gold product"
            onClick={() => goPrev(TOP_GOLD_COLLECTION_PRODUCTS.length, setGoldMobileIndex)}
          >
            ‹
          </button>

          <div className={styles.mobileProductsViewport}>
            <div
              className={styles.mobileProductsTrack}
              style={{ transform: `translateX(-${goldMobileIndex * 100}%)` }}
            >
              {TOP_GOLD_COLLECTION_PRODUCTS.map((product, index) => (
                <div key={product.id} className={styles.mobileProductSlide}>
                  <div className={styles.productCard}>
                    <Link to={`/products/${product.id}`} className={styles.productCardLink}>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading={index === goldMobileIndex ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={index === goldMobileIndex ? 'high' : 'low'}
                      />
                      <div className={styles.overlay}>
                        <h3>{product.name}</h3>
                        <span className={styles.viewLink}>View Details</span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.mobileNavBtn}
            aria-label="Next gold product"
            onClick={() => goNext(TOP_GOLD_COLLECTION_PRODUCTS.length, setGoldMobileIndex)}
          >
            ›
          </button>
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

        <div className={styles.mobileProductsCarousel}>
          <button
            type="button"
            className={styles.mobileNavBtn}
            aria-label="Previous silver product"
            onClick={() => goPrev(TRENDING_SILVER_COLLECTION_PRODUCTS.length, setSilverMobileIndex)}
          >
            ‹
          </button>

          <div className={styles.mobileProductsViewport}>
            <div
              className={styles.mobileProductsTrack}
              style={{ transform: `translateX(-${silverMobileIndex * 100}%)` }}
            >
              {TRENDING_SILVER_COLLECTION_PRODUCTS.map((product, index) => (
                <div key={product.id} className={styles.mobileProductSlide}>
                  <div className={styles.productCard}>
                    <Link to={`/products/${product.id}`} className={styles.productCardLink}>
                      <img
                        src={product.image}
                        alt={product.name}
                        loading={index === silverMobileIndex ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={index === silverMobileIndex ? 'high' : 'low'}
                      />
                      <div className={styles.overlay}>
                        <h3>{product.name}</h3>
                        <span className={styles.viewLink}>View Details</span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={styles.mobileNavBtn}
            aria-label="Next silver product"
            onClick={() => goNext(TRENDING_SILVER_COLLECTION_PRODUCTS.length, setSilverMobileIndex)}
          >
            ›
          </button>
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

      {/* ── BRAND STORY ── */}
      <section className={styles.storySection}>
        <div className={styles.storyContainer}>
          <div className={styles.storyImage}>
            <button
              type="button"
              className={styles.storyImageButton}
              onClick={() => {
                setIsBridalImageOpen(true)
                setIsBridalInnerZoomed(false)
                setBridalTransformOrigin('50% 50%')
              }}
              aria-label="Open bridal image in fullscreen"
            >
              <img src="https://res.cloudinary.com/dm4gxqwq4/image/upload/v1775455642/ssv-jewellers/bangles/rivzdw0rioyavbn4iovk.jpg" alt="SSV Jewellers bridal jewellery set" loading="lazy" decoding="async" />
            </button>
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

      {isBridalImageOpen && (
        <div
          className={styles.bridalImageModal}
          role="dialog"
          aria-modal="true"
          aria-label="Bridal image fullscreen preview"
          onClick={closeBridalModal}
          onMouseMove={handleBridalMouseMove}
          onTouchMove={handleBridalTouchMove}
        >
          <button
            type="button"
            className={styles.bridalImageClose}
            onClick={closeBridalModal}
            aria-label="Close bridal image preview"
          >
            ×
          </button>
          <div className={styles.bridalImageWrap} onClick={(event) => event.stopPropagation()}>
            <img
              src="https://res.cloudinary.com/dm4gxqwq4/image/upload/v1775455642/ssv-jewellers/bangles/rivzdw0rioyavbn4iovk.jpg"
              alt="SSV Jewellers bridal jewellery set"
              className={`${styles.bridalImageFull} ${isBridalInnerZoomed ? styles.bridalImageFullActive : ''}`}
              loading="eager"
              decoding="async"
              style={{ transformOrigin: bridalTransformOrigin }}
              onClick={handleBridalImageClick}
              onDoubleClick={handleBridalDoubleTap}
            />
          </div>
        </div>
      )}

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
