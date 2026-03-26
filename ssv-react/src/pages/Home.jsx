import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import styles from './Home.module.css'


/* ── Carousel data ── */
const SLIDES = [
  {
    img: '/picture/carousel-images/SSV_ Ad-1.jpg.jpeg',
    alt: 'Banner 1',
    title: 'Gold Heritage Collection',
    desc: 'Timeless handcrafted jewellery for every celebration.',
    link: '/products?search=gold',
  },
  {
    img: '/picture/carousel-images/SSV_Ads_Banners-01.jpg.jpeg',
    alt: 'Banner 2',
    title: 'Silver Signature Collection',
    desc: 'Classic shine crafted for modern elegance.',
    link: '/products?search=silver',
  },
  {
    img: '/picture/carousel-images/SSV_ Ads_Banners-02.jpg.jpeg',
    alt: 'Banner 3',
    title: 'Diamond Prestige Collection',
    desc: 'Brilliance that elevates every special moment.',
    link: '/products?search=diamond',
  },
]

/* ── Home product cards ── */
const HOME_PRODUCTS = [
  { title: 'Necklace Collection', link: '/products?search=gold', img: '/picture/section-one.jpeg' },
  { title: 'Haram Collection', link: '/products?search=silver', img: '/picture/section-twoo.jpeg' },
  { title: 'Chokers Collection', link: '/products?search=diamond', img: '/picture/section-three.jpeg' },
  { title: 'Bangles Collection', link: '/products?search=gold', img: '/picture/section-one.jpeg' },
  { title: 'CZ Collection', link: '/products?search=silver', img: '/picture/section-twoo.jpeg' },



]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)

  // Scroll helper that accounts for fixed header padding
  function scrollToIdWithOffset(id) {
    if (!id) return
    const el = document.getElementById(id)
    if (!el) return
    const bodyPadding = parseInt(getComputedStyle(document.body).paddingTop, 10) || 100
    const top = el.getBoundingClientRect().top + window.scrollY - bodyPadding - 8
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const goTo = useCallback((idx) => {
    setActiveSlide(idx)
  }, [])

  const prev = useCallback(() => setActiveSlide(s => (s - 1 + SLIDES.length) % SLIDES.length), [])
  const next = useCallback(() => setActiveSlide(s => (s + 1) % SLIDES.length), [])

  /* Auto-advance */
  useEffect(() => {
    timerRef.current = setInterval(() => setActiveSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  // On mount, handle deep link scrolling (e.g., /#contact) or ensure page is at top after reload
  useEffect(() => {
    // small delay to allow layout to stabilise
    const id = window.location.hash ? window.location.hash.replace('#', '') : ''
    setTimeout(() => {
      if (id) {
        scrollToIdWithOffset(id)
      } else {
        // ensure we are at top after a refresh
        window.scrollTo({ top: 0 })
      }
    }, 120)
  }, [])

  return (
    <>
      <Helmet>
        <title>SSV Jewellers – Luxury Gold, Silver &amp; Diamond Collection</title>
        <meta name="description" content="Discover handcrafted gold, silver, and diamond jewellery at SSV Jewellers. Timeless elegance for every celebration." />
        <meta property="og:title" content="SSV Jewellers – Luxury Collection" />
        <meta property="og:description" content="Handcrafted gold, silver, and diamond jewellery." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ssvjewellers.com/" />
      </Helmet>

      {/* ── CAROUSEL ── */}
      <section className={styles.carousel} aria-label="Featured jewellery carousel">
        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <article
                key={i}
                className={styles.slide}
                aria-hidden={i !== activeSlide}
              >
                <img src={slide.img} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
                {/* Removed View details button from top of carousel */}
              </article>
            ))}
          </div>

          <button className={`${styles.control} ${styles.prev}`} onClick={prev} aria-label="Previous slide">‹</button>
          <button className={`${styles.control} ${styles.next}`} onClick={next} aria-label="Next slide">›</button>
        </div>

      </section>




      {/* ── PRODUCT GRID ── */}
      {/* Large section header (e.g. "DIAMOND JEWELLERY") */}
      <div className={styles.productsHeader} aria-hidden="true">
        <h2>GOLD JEWELLERY</h2>
      </div>
      <section className={styles.productsSection} aria-label="Product collections">
        <motion.div
          className={styles.homeProductGrid}
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          {HOME_PRODUCTS.map((p, i) => (
            <motion.div key={i} className={styles.productCard} variants={fadeUp}>
              <Link to={p.link} className={styles.productImageLink} aria-label={`Open ${p.title} details`}>
                <img src={p.img} alt={p.title} loading="lazy" />
              </Link>
              <div className={styles.overlay}>
                <h3>{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Large section header (e.g. "SILVER JEWELLERY") */}
      <div className={styles.productsHeader} aria-hidden="true">
        <h2>SILVER JEWELLERY</h2>
      </div>
      <section className={styles.productsSection} aria-label="Product collections">
        <motion.div
          className={styles.homeProductGrid}
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          {HOME_PRODUCTS.map((p, i) => (
            <motion.div key={i} className={styles.productCard} variants={fadeUp}>
              <Link to={p.link} className={styles.productImageLink} aria-label={`Open ${p.title} details`}>
                <img src={p.img} alt={p.title} loading="lazy" />
              </Link>
              <div className={styles.overlay}>
                <h3>{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      {/* Large section header (e.g. "DIAMOND JEWELLERY") */}
      <div className={styles.productsHeader} aria-hidden="true">
        <h2>DIAMOND JEWELLERY</h2>
      </div>
      <section className={styles.productsSection} aria-label="Product collections">
        <motion.div
          className={styles.homeProductGrid}
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
        >
          {HOME_PRODUCTS.map((p, i) => (
            <motion.div key={i} className={styles.productCard} variants={fadeUp}>
              <Link to={p.link} className={styles.productImageLink} aria-label={`Open ${p.title} details`}>
                <img src={p.img} alt={p.title} loading="lazy" />
              </Link>
              <div className={styles.overlay}>
                <h3>{p.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
     
      {/* ── SECTION 1 – image left / text right ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.imageBox}>
            {/* Use the section-two image for Section One (left-hand hero) */}
            <img src="/picture/section-three.jpeg" alt="SSV Jewellers craftsmanship" loading="lazy" />
          </div>
          <div className={styles.contentBox}>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              Timeless Jewellery Craftsmanship
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              Discover handcrafted gold, silver, and diamond designs made to
              celebrate your most special moments with timeless elegance.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              <Link to="/about" className={styles.readMoreBtn}>View details »</Link>
            </motion.div>
          </div>
          <div className={styles.imageBox}>
            <img src="/picture/section-twoo.jpeg" alt="SSV Jewellers collection" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 – text left / image right ── */}
      <section className={`${styles.section} ${styles.sectionReverse}`}>
        <div className={styles.container}>
          <div className={styles.contentBox}>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              Pure Crafted Excellence
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              Each piece is thoughtfully designed to reflect elegance and precision,
              using only the finest certified materials.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inViewViewport}
            >
              <Link to="/products" className={styles.readMoreBtn}>View details »</Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* removed embedded Contact — contact is now a separate page */}

    </>
  )
}
