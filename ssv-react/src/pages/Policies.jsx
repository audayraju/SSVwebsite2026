import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import styles from './Policies.module.css'

export default function Policies() {
  return (
    <>
      <Helmet>
        <title>Policies | SSV Jewellers</title>
        <meta name="description" content="SSV Jewellers policies – privacy, returns, shipping and terms of service." />
        <link rel="canonical" href="https://ssvjewellers.com/policies" />
      </Helmet>

      <div className={styles.wrapper}>
        <h1>Our Policies</h1>

        <section className={styles.section}>
          <h2>Privacy Policy</h2>
          <p>
            SSV Jewellers is committed to protecting your personal information. We collect only
            the information necessary to process enquiries and orders. Your data is never sold
            to third parties. For details on what we collect and how we use it, please contact us.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Return &amp; Exchange Policy</h2>
          <p>
            We accept returns and exchanges within 7 days of purchase, provided the item is in its
            original condition with all certificates and packaging. Custom-made and engraved items
            are non-returnable.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Shipping Policy</h2>
          <p>
            All orders are shipped via insured courier with tracking. Orders within India are
            typically delivered in 5–7 business days. International shipping timelines vary.
            Shipping charges are calculated at checkout.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Terms of Service</h2>
          <p>
            By using our website and services you agree to our terms. Prices are subject to change
            without notice. All jewellery images are for representation purposes only – actual
            products may vary slightly. SSV Jewellers reserves the right to cancel orders in case
            of pricing errors.
          </p>
        </section>

        <Link to="/" className={styles.homeLink}>← Back to Home</Link>
      </div>
    </>
  )
}
