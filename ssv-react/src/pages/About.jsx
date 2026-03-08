import { Helmet } from 'react-helmet-async'
import styles from './About.module.css'

const SPECIALIZATIONS = [
  {
    title: 'Diamond',
    desc: 'Exquisite diamond jewelry featuring certified gemstones of superior quality and brilliance.',
    features: ['Certified diamonds (GIA, AGS)', 'High clarity and color grades', 'Custom diamond settings', 'Expert appraisals'],
  },
  {
    title: 'Gold',
    desc: 'Premium gold jewelry crafted in 24K, 18K, and 14K gold with timeless designs and artistic excellence.',
    features: ['18K & 24K gold options', 'Fine artistic designs', 'Hallmarked authenticity', 'Custom gold crafting'],
  },
  {
    title: 'Silver',
    desc: 'Elegant sterling silver jewelry with intricate designs, perfect for everyday wear and special occasions.',
    features: ['925 sterling silver', 'Contemporary designs', 'Affordable luxury', 'Personalized engraving'],
  },
]

const WHY_CHOOSE = [
  { title: 'Quality Assurance', desc: 'Every piece undergoes rigorous quality inspection to ensure perfection.' },
  { title: 'Authentic Certification', desc: 'All gemstones come with proper certification and documentation.' },
  { title: 'Expert Craftsmanship', desc: 'Our master artisans bring decades of experience to every creation.' },
  { title: 'Custom Designs', desc: 'We create bespoke jewelry tailored to your unique vision.' },
  { title: 'Lifetime Warranty', desc: 'Comprehensive warranty and after-sales service on all collections.' },
  { title: 'Ethical Sourcing', desc: 'All materials sourced responsibly and ethically.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | SSV Jewellers</title>
        <meta name="description" content="Learn about SSV Jewellers – our specialisations in gold, silver, and diamond jewellery, our mission, vision, and why customers trust us." />
        <meta property="og:title" content="About Us | SSV Jewellers" />
        <link rel="canonical" href="https://ssvjewellers.com/about" />
      </Helmet>

      <div className={styles.aboutPanel}>

        {/* ── Specializations ── */}
        <div className={styles.specializationsSection}>
          <div className={styles.specialHeader}>
            <h2>About our Store</h2>
            <div className={styles.paraGroup}>
              <p className={styles.para}>Welcome to SSV Jewellery, a trusted destination for elegant and timeless jewellery. Established in 2017, our store has been dedicated to offering high-quality gold, silver, and diamond jewellery crafted with precision and care. From traditional designs to modern styles, we bring a beautiful collection that suits every occasion—weddings, celebrations, and everyday elegance. Our goal is to provide jewellery that not only enhances beauty but also becomes a cherished memory for our customers. At SSV Jewellery, we believe that jewellery is more than an accessory; it is a symbol of love, tradition, and personal expression. Every piece in our collection is carefully selected to ensure the finest craftsmanship and lasting value.</p>
            </div>
          </div>
          <div className={styles.specializationsPanel}>
            <div className={styles.specializationsGrid}>
              {SPECIALIZATIONS.map(spec => (
                <div key={spec.title} className={styles.specializationCard}>
                  <div className={styles.specTitle}>{spec.title}</div>
                  <div className={styles.specDescription}>{spec.desc}</div>
                  <div className={styles.specFeatures}>
                    <ul>{spec.features.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className={styles.whyChooseUs}>
        <h2>Why Choose Us?</h2>
        <div className={styles.featuresList}>
          {WHY_CHOOSE.map(item => (
            <div key={item.title} className={styles.featureItem}>
              <div className={styles.featureText}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission / Vision ── */}
      <div className={styles.missionVision}>
        <div className={styles.missionBox}>
          <h3>Our Mission</h3>
          <p>
            To create exceptional jewelry pieces that celebrate love, commitment, and personal
            milestones. We are committed to providing the highest quality craftsmanship,
            exceptional service, and beautiful designs that become treasured heirlooms for
            generations to come.
          </p>
        </div>
        <div className={styles.visionBox}>
          <h3>Our Vision</h3>
          <p>
            To be recognised globally as the premier destination for luxury jewelry, where
            artistry meets authenticity. We envision a world where every person can own a piece
            of timeless elegance that tells their unique story.
          </p>
        </div>
      </div>
    </>
  )
}
