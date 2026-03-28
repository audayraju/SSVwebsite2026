import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
import styles from './Services.module.css'

const SERVICES = [
  {
    icon: '🎨',
    title: 'Custom Design',
    desc: 'Create your dream jewelry piece with our expert designers. From concept to creation, we bring your vision to life.',
    features: ['Personal consultation', 'CAD design preview', 'Material selection', 'Handcrafted creation'],
  },
  {
    icon: '🔧',
    title: 'Repairs & Restoration',
    desc: 'Professional repair and restoration services to restore your jewelry to its original brilliance.',
    features: ['Ring sizing', 'Stone replacement', 'Cleaning & polishing', 'Structural repairs'],
  },
  {
    icon: '📋',
    title: 'Appraisals',
    desc: 'Professional jewelry appraisal for insurance, resale, or estate purposes with certified documentation.',
    features: ['Certified appraisals', 'Gemstone analysis', 'Insurance documentation', 'Fair market value'],
  },
]

const FAQS = [
  { q: 'How long does jewelry repair take?', a: 'Most repairs take 5–10 business days. Simple repairs like cleaning can be done same-day. We\'ll provide an exact timeline during consultation.' },
  { q: 'Do you provide warranties on repairs?', a: 'Yes! All repairs come with a 1-year warranty. We stand behind our workmanship and will fix any issues at no additional cost.' },
  { q: 'Can you resize all types of rings?', a: 'We can resize most rings in gold, silver, and platinum. Some styles may have limitations. Contact us for specific questions.' },
  { q: 'What makes your custom designs unique?', a: 'Our master craftsmen work directly with you to create one-of-a-kind pieces. We use CAD design for preview before creation.' },
  { q: 'Are your appraisals accepted by insurers?', a: 'Yes! Our appraisals are certified and recognised by major insurance companies for coverage and claims purposes.' },
]

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <Helmet>
        <title>Our Services | SSV Jewellers</title>
        <meta name="description" content="SSV Jewellers offers custom jewellery design, expert repairs, restoration, and certified appraisals." />
        <meta property="og:title" content="Our Services | SSV Jewellers" />
        <link rel="canonical" href="https://ssvjewellers.com/services" />
      </Helmet>

      {/* ── SERVICES HEADER ── */}
      <section className={styles.servicesHero}>
          <motion.div className={styles.heroContent} variants={fadeUp} initial="hidden" animate="visible" viewport={inViewViewport}>
              <h1>Exceptional <span className={styles.goldText}>Services</span></h1>
              <p>Preserving the beauty and value of your precious collections with expert care.</p>
          </motion.div>
      </section>

      <motion.div className={styles.content} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
        
        {/* ── SERVICES GRID ── */}
        <div className={styles.servicesPanel}>
          <motion.div className={styles.servicesGrid} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
            {SERVICES.map(s => (
              <motion.div key={s.title} className={styles.serviceCard} variants={fadeUp}>
                <div className={styles.serviceHeader}>
                    <div className={styles.serviceIcon}>{s.icon}</div>
                    <div className={styles.serviceTitle}>{s.title}</div>
                </div>
                <div className={styles.serviceDescription}>{s.desc}</div>
                <div className={styles.serviceFeatures}>
                  <ul>{s.features.map(f => <li key={f}><span>{f}</span></li>)}</ul>
                </div>
                <div className={styles.cardFooter}>
                    <a href="tel:+919177396962" className={styles.serviceBtn}>Enquire Now</a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── FAQ SECTION ── */}
        <section className={styles.faqWrapper}>
            <motion.div className={styles.faqSection} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
              <motion.h2 className={styles.faqTitle} variants={fadeUp}>Common Questions</motion.h2>
              <div className={styles.faqList}>
                  {FAQS.map((faq, i) => (
                    <motion.div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`} variants={fadeUp}>
                      <button
                        className={styles.faqQuestion}
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                      >
                        <span className={styles.faqQText}>{faq.q}</span>
                        <div className={styles.faqToggle}>
                           <div className={styles.toggleLine}></div>
                           <div className={`${styles.toggleLine} ${styles.toggleVertical}`}></div>
                        </div>
                      </button>
                      <div className={styles.faqAnswerWrapper}>
                           <div className={styles.faqAnswer}>{faq.a}</div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section className={styles.servicesCTA}>
            <motion.div className={styles.ctaBox} variants={fadeUp}>
                <h2>Have a specific requirement?</h2>
                <p>Visit our store or contact us to discuss your custom jewelry project.</p>
                <div className={styles.ctaButtons}>
                    <a href="tel:+919177396962" className={styles.primaryCTA}>Contact Us</a>
                    <a href="/contact#store-map" className={styles.secondaryCTA}>View Map</a>
                </div>
            </motion.div>
        </section>
      </motion.div>
    </>
  )
}
