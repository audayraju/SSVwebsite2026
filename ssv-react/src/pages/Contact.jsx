import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import { apiUrl } from '../lib/api'
import styles from './Contact.module.css'

const FALLBACK_REVIEWS = [
  {
    name: 'Shiva Nandu',
    rating: 5,
    when: '2 days ago',
    meta: '1 review · 1 photo',
    text: 'Nice collections gold and silver 😍💖',
  },
  {
    name: 'Anusha K',
    rating: 5,
    when: '5 days ago',
    meta: '3 reviews',
    text: 'Excellent designs and friendly staff. Great shopping experience at SSV Jewellers.',
  },
  {
    name: 'Ramesh Kumar',
    rating: 5,
    when: '14 Mar 2026',
    meta: '2 reviews · 2 photos',
    text: 'Reasonable pricing, authentic quality, and very good service. Highly recommended.',
  },
]

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() || '')
    .join('')
}

export default function Contact() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [googleReviewsUrl, setGoogleReviewsUrl] = useState('https://www.google.com/maps?q=CG35%2B3XW%2C%20Sri%20shakthi%20Vinayaka%20Jewellers%2C%20Vidya%20Nagar%2C%20Ram%20Nagar%20Gundu%2C%20Adikmet%2C%20Hyderabad%2C%20Telangana%20500044')

  useEffect(() => {
    let active = true

    async function loadGoogleReviews() {
      try {
        const res = await fetch(apiUrl('/api/google-reviews'))
        if (!res.ok) return

        const data = await res.json()
        if (!active) return

        if (Array.isArray(data.reviews) && data.reviews.length) {
          setReviews(data.reviews)
          setReviewIndex(0)
        }

        if (typeof data.googleMapsUrl === 'string' && data.googleMapsUrl.trim()) {
          setGoogleReviewsUrl(data.googleMapsUrl)
        }
      } catch {
        // keep fallback reviews silently
      }
    }

    loadGoogleReviews()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!reviews.length) return undefined
    const timer = setInterval(() => {
      setReviewIndex(prev => (prev + 1) % reviews.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [reviews.length])

  const review = reviews[reviewIndex] ?? FALLBACK_REVIEWS[0]

  return (
    <>
      <Helmet>
        <title>Contact Us | SSV Jewellers</title>
        <meta name="description" content="Contact SSV Jewellers – visit our store, call us, or message us on WhatsApp. Premium wholesale and retail jewellery." />
        <meta property="og:title" content="Contact Us | SSV Jewellers" />
        <link rel="canonical" href="https://ssvjewellers.com/contact" />
      </Helmet>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroOrbs}></div>
        <motion.div className={styles.heroLeft} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>✨ Certified & Hallmarked</span>
            <span className={styles.heroBadge}>🏭 Manufacturers / Wholesale</span>
          </div>
          <h1><span className={styles.goldText}>Luxury Gold & Diamond Jewellery</span></h1>
          <p>Premium wholesale &amp; retail jewellery crafted with perfection and elegance.</p>
          <div className={styles.heroActions}>
            <a href="tel:+919177396962" className={styles.callBtn}>
              📞 Contact Now
            </a>
   </div>
        </motion.div>

        <motion.div className={styles.heroRight} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
          <img src="/images/neckalce/SSV-NECKALCES-019.jpg" alt="SSV Jewellers luxury bridal collection display" loading="eager" decoding="async" fetchPriority="high" />
          <div className={styles.socialIcons}>
            <a href="https://facebook.com/profile.php?id=61584739588200" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="bi bi-facebook" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/ssv_jewellers_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@SSV_Jewellers" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="bi bi-youtube" aria-hidden="true" />
            </a>
            <a href="https://wa.me/9177396962" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="bi bi-whatsapp" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── MAP ── */}
      <motion.section id="store-map" className={styles.mapSection} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
        <div className={styles.sectionTitleWrapper}>
          <span className={styles.titleLine}></span>
          <span className={styles.titleDot}></span>
          <h2>VISIT OUR STORE</h2>
          <span className={styles.titleDot}></span>
          <span className={styles.titleLine}></span>
        </div>
        <motion.iframe
          variants={fadeUp}
          src="https://www.google.com/maps?q=CG35%2B3XW%2C%20Sri%20shakthi%20Vinayaka%20Jewellers%2C%20Vidya%20Nagar%2C%20Ram%20Nagar%20Gundu%2C%20Adikmet%2C%20Hyderabad%2C%20Telangana%20500044&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SSV Jewellers store location"
          aria-label="Google Map showing SSV Jewellers location"
        />

        <motion.div className={styles.reviewsSection} aria-live="polite" variants={fadeUp}>
          <h3>Customer Reviews</h3>
          <article className={styles.reviewCard}>
            <header className={styles.reviewHead}>
              <div className={styles.reviewerAvatar} aria-hidden="true">
                {review.photoUrl
                  ? <img src={review.photoUrl} alt="" className={styles.reviewerAvatarImg} loading="lazy" />
                  : getInitials(review.name)}
              </div>
              <div className={styles.reviewerMeta}>
                <p className={styles.reviewAuthorName}>{review.name}</p>
                <p className={styles.reviewSub}>{review.meta}</p>
              </div>
            </header>

            <p className={styles.reviewStars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p className={styles.reviewWhen}>{review.when}</p>
            <p className={styles.reviewText}>“{review.text}”</p>
          </article>

          <a
            className={styles.reviewLink}
            href={googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View all reviews on Google
          </a>
        </motion.div>
      </motion.section>
    </>
  )
}
