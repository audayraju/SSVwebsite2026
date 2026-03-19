import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styles from './Home.module.css'

/* ── Carousel data ── */
const SLIDES = [
  {
    img: '/image.png',
    alt: 'Premium Gold Jewellery',
    title: 'Gold Heritage Collection',
    desc: 'Timeless handcrafted jewellery for every celebration.',
    link: '/products?search=gold',
  },
  {
    img: '/image.png',
    alt: 'Elegant Silver Jewellery',
    title: 'Silver Signature Collection',
    desc: 'Classic shine crafted for modern elegance.',
    link: '/products?search=silver',
  },
  {
    img: '/image.png',
    alt: 'Premium Diamond Jewellery',
    title: 'Diamond Prestige Collection',
    desc: 'Brilliance that elevates every special moment.',
    link: '/products?search=diamond',
  },
]

/* ── Feature cards ── */
const FEATURES = [
  { title: 'Trending #1', desc: 'Handcrafted gold designs made with the finest craftsmanship.', link: '/products?search=gold', img: '/image.png', alt: 'Gold feature' },
  { title: 'Trending #2', desc: 'Classic silver jewellery for modern elegance and everyday wear.', link: '/products?search=silver', img: '/image.png', alt: 'Silver feature' },
  { title: 'Trending #3', desc: 'Diamond pieces that shine at every special occasion.', link: '/products?search=diamond', img: '/image.png', alt: 'Diamond feature' },
]

/* ── Home product cards ── */
const HOME_PRODUCTS = [
  { title: 'Gold Collection', link: '/products?search=gold', img: '/image.png' },
  { title: 'Silver Collection', link: '/products?search=silver', img: '/image.png' },
  { title: 'Diamond Collection', link: '/products?search=diamond', img: '/image.png' },
]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)

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
                <div className={styles.caption}>
                  <h2>{slide.title}</h2>
                  <p>{slide.desc}</p>
                  <Link to={slide.link} className={styles.carouselBtn}>View details »</Link>
                </div>
              </article>
            ))}
          </div>

          <button className={`${styles.control} ${styles.prev}`} onClick={prev} aria-label="Previous slide">‹</button>
          <button className={`${styles.control} ${styles.next}`} onClick={next} aria-label="Next slide">›</button>
        </div>

      </section>

      {/* ── THREE FEATURE COLUMNS ── */}
      <section className={styles.viewThree} aria-label="Featured categories">
        <div className={styles.viewGrid}>
          {FEATURES.map((f, i) => (
            <article key={i} className={styles.viewItem}>
              <img src={f.img} alt={f.alt} className={styles.avatar} loading="lazy" />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <Link to={f.link} className={styles.viewBtn}>View details »</Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── SECTION 1 – image left / text right ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.imageBox}>
            <img src="/image.png" alt="SSV Jewellers craftsmanship" loading="lazy" />
          </div>
          <div className={styles.contentBox}>
            <h2>Timeless Jewellery Craftsmanship</h2>
            <p>
              Discover handcrafted gold, silver, and diamond designs made to
              celebrate your most special moments with timeless elegance.
            </p>
            <Link to="/about" className={styles.readMoreBtn}>Read More</Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 – text left / image right ── */}
      <section className={`${styles.section} ${styles.sectionReverse}`}>
        <div className={`${styles.container} ${styles.reverse}`}>
          <div className={styles.contentBox}>
            <h2>Pure Crafted Excellence</h2>
            <p>
              Each piece is thoughtfully designed to reflect elegance and precision,
              using only the finest certified materials.
            </p>
            <Link to="/products" className={styles.readMoreBtn}>Explore</Link>
          </div>
          <div className={styles.imageBox}>
            <img src="/image.png" alt="SSV Jewellers collection" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <section className={styles.productsSection} aria-label="Product collections">
        <div className={styles.homeProductGrid}>
          {HOME_PRODUCTS.map((p, i) => (
            <div key={i} className={styles.productCard}>
              <img src={p.img} alt={p.title} loading="lazy" />
              <div className={styles.overlay}>
                <h3>{p.title}</h3>
                <div className={styles.cardActions}>
                  <Link to={p.link} className={styles.knowBtn}>Know more</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
