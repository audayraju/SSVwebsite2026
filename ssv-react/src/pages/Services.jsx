import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
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
  { q: 'How long does jewelry repair take?',          a: 'Most repairs take 5–10 business days. Simple repairs like cleaning can be done same-day. We\'ll provide an exact timeline during consultation.' },
  { q: 'Do you provide warranties on repairs?',        a: 'Yes! All repairs come with a 1-year warranty. We stand behind our workmanship and will fix any issues at no additional cost.' },
  { q: 'Can you resize all types of rings?',           a: 'We can resize most rings in gold, silver, and platinum. Some styles may have limitations. Contact us for specific questions.' },
  { q: 'What makes your custom designs unique?',       a: 'Our master craftsmen work directly with you to create one-of-a-kind pieces. We use CAD design for preview before creation.' },
  { q: 'Are your appraisals accepted by insurers?',    a: 'Yes! Our appraisals are certified and recognised by major insurance companies for coverage and claims purposes.' },
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

      <div className={styles.content}>
        <div className={styles.servicesHeader}>
          <h1>Our Services</h1>
          <p className={styles.subtitle}>Comprehensive jewelry solutions tailored to your needs</p>
          <div className={styles.servicesIntro}>
            <p>
              At SSV Jewellers, we offer a wide range of professional services to ensure your
              jewelry remains beautiful, secure, and valuable. Our expert team is dedicated to
              providing exceptional service with attention to detail.
            </p>
          </div>
        </div>

        <div className={styles.servicesPanel}>
          <div className={styles.servicesGrid}>
            {SERVICES.map(s => (
              <div key={s.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <div className={styles.serviceTitle}>{s.title}</div>
                <div className={styles.serviceDescription}>{s.desc}</div>
                <div className={styles.serviceFeatures}>
                  <ul>{s.features.map(f => <li key={f}>{f}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <span className={`${styles.faqArrow}${openFaq === i ? ` ${styles.faqArrowOpen}` : ''}`}>▼</span>
              </button>
              {openFaq === i && (
                <div className={styles.faqAnswer}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
