import { Helmet } from 'react-helmet-async'
import styles from './Contact.module.css'

export default function Contact() {
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
        <div className={styles.heroLeft}>
          <h1>Luminous<br />Handmade Jewelry</h1>
          <p>Premium wholesale &amp; retail jewellery crafted with perfection and elegance.</p>
          <div className={styles.heroActions}>
            <a href="tel:+919876543210" className={styles.callBtn}>
              <span>📞 Contact Now</span>
            </a>
          </div>
        </div>

        <div className={styles.heroRight}>
          <img src="/slides/03.png" alt="SSV Jewellers jewellery display" loading="lazy" />
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="bi bi-facebook" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@ssvjeweller" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="bi bi-youtube" aria-hidden="true" />
            </a>
            <a href="https://wa.me/916281049201" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="bi bi-whatsapp" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className={styles.mapSection}>
        <h2>Visit Our Store</h2>
        <iframe
          src="https://maps.app.goo.gl/fS5d2jJRwi3N7SRb9?g_st=ic"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SSV Jewellers store location"
          aria-label="Google Map showing SSV Jewellers location"
        />
      </section>
    </>
  )
}
