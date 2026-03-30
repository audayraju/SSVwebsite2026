import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { fadeUp, staggerParent, inViewViewport } from '../components/motionPresets'
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
        <meta name="description" content="Learn about SSV Jewellers – our story, our passion for gold and diamonds, and why we are trusted since 2017." />
        <meta property="og:title" content="About Us | SSV Jewellers" />
        <link rel="canonical" href="https://ssvjewellers.com/about" />
      </Helmet>

      {/* ── ABOUT HERO ── */}
      <section className={styles.aboutHero}>
        <div className={styles.heroOverlay}></div>
        <motion.div className={styles.heroContent} variants={fadeUp} initial="hidden" animate="visible">
          <span className={styles.sinceBadge}>EST. 2017</span>
          <h1>Our Legacy of <br /><span className={styles.goldText}>Elegance</span></h1>
          <p>Crafting more than just jewelry; we craft cherished memories that last generations.</p>
        </motion.div>
      </section>

      <motion.div className={styles.aboutPanel} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>

        {/* ── OUR STORY ── */}
        <section className={styles.storySection}>
            <div className={styles.storyGrid}>
                <motion.div className={styles.storyText} variants={fadeUp}>
                    <h2 className={styles.sectionTitle}>Our Story</h2>
                    <p>Welcome to SSV Jewellery, a trusted destination for elegant and timeless jewellery. Established in 2017, our store has been dedicated to offering high-quality gold, silver, and diamond jewellery crafted with precision and care.</p>
                    <p>From traditional designs to modern styles, we bring a beautiful collection that suits every occasion—weddings, celebrations, and everyday elegance. Our goal is to provide jewellery that not only enhances beauty but also becomes a cherished memory for our customers.</p>
                    <p>At SSV Jewellery, we believe that jewellery is more than an accessory; it is a symbol of love, tradition, and personal expression. Every piece in our collection is carefully selected to ensure the finest craftsmanship and lasting value.</p>
                </motion.div>
                <motion.div className={styles.storyImage} variants={fadeUp}>
                    <div className={styles.imageWrapper}>
                         <img src="/slides/pictures/about_craft.png" alt="Exquisite craftsmanship at SSV Jewellers" />
                         <div className={styles.imageCard}>
                             <h3>Master Craftsmen</h3>
                             <p>Hand-finishing every piece to perfection</p>
                         </div>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* ── SPECIALIZATIONS ── */}
        <div className={styles.specializationsSection}>
          <div className={styles.specialHeader}>
            <h2 className={styles.sectionTitle}>Our Specializations</h2>
          </div>
          <div className={styles.specializationsPanel}>
            <motion.div className={styles.specializationsGrid} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
              {SPECIALIZATIONS.map(spec => (
                <motion.div key={spec.title} className={styles.specializationCard} variants={fadeUp}>
                  <div className={styles.specIcon}>
                      {spec.title === 'Diamond' && '💎'}
                      {spec.title === 'Gold' && '✨'}
                      {spec.title === 'Silver' && '🌙'}
                  </div>
                  <div className={styles.specTitle}>{spec.title}</div>
                  <div className={styles.specDescription}>{spec.desc}</div>
                  <div className={styles.specFeatures}>
                    <ul>{spec.features.map(f => <li key={f}>{f}</li>)}</ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── WHY CHOOSE US ── */}
      <section className={styles.whyChooseSection}>
          <motion.div className={styles.whyChooseUs} variants={fadeUp} initial="hidden" whileInView="visible" viewport={inViewViewport}>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>Why Choose Us?</motion.h2>
            <motion.div className={styles.featuresList} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
              {WHY_CHOOSE.map((item, index) => (
                <motion.div key={item.title} className={styles.featureItem} variants={fadeUp}>
                  <div className={styles.featureIcon}>
                      {index === 0 && '🏆'}
                      {index === 1 && '📜'}
                      {index === 2 && '👨‍🎨'}
                      {index === 3 && '🖋️'}
                      {index === 4 && '🛡️'}
                      {index === 5 && '🤝'}
                  </div>
                  <div className={styles.featureText}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
      </section>

      {/* ── MISSION / VISION ── */}
      <section className={styles.missionVisionSection}>
          <motion.div className={styles.missionVision} variants={staggerParent} initial="hidden" whileInView="visible" viewport={inViewViewport}>
            <motion.div className={styles.missionBox} variants={fadeUp}>
              <div className={styles.boxIcon}>🎯</div>
              <h3>Our Mission</h3>
              <p>To create exceptional jewelry pieces that celebrate love, commitment, and personal milestones. We are committed to providing the highest quality craftsmanship, exceptional service, and beautiful designs.</p>
            </motion.div>
            <motion.div className={styles.visionBox} variants={fadeUp}>
              <div className={styles.boxIcon}>👁️</div>
              <h3>Our Vision</h3>
              <p>To be recognised globally as the premier destination for luxury jewelry, where artistry meets authenticity. We envision a world where every person can own a piece of timeless elegance.</p>
            </motion.div>
          </motion.div>
      </section>
    </>
  )
}
