import { useEffect, useState } from 'react'
import styles from './ProductModal.module.css'

export default function ProductModal({ product, onClose }) {
  const [descOpen, setDescOpen] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)

  /* Close on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const {
    name, sku, price, description, specs = [], extra, category,
    product_image,
  } = product

  const imgSrc = product_image
    ? (product_image.startsWith('http') ? product_image : `/uploads/${product_image}`)
    : '/slides/pictures/logo.jpeg'

  const waMsg = encodeURIComponent(`Hi, I'm interested in ${name} (${sku || ''}). Could you share more details?`)
  const waLink = `https://wa.me/916281049201?text=${waMsg}`

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close">×</button>

        <div className={styles.left}>
          <img src={imgSrc} alt={name} className={styles.img} loading="lazy" />
        </div>

        <div className={styles.right}>
          <h2 id="modalTitle" className={styles.title}>{name}</h2>
          {sku   && <p className={styles.sku}>{sku}</p>}

          <div className={styles.priceWrap}>
            {price && <p className={styles.price}>{price}</p>}
            <a href={waLink} className={styles.waBtn} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>

          {/* Description accordion */}
          <div className={styles.detailSection}>
            <div className={styles.detailHead}>
              <span>Description</span>
              <button
                className={styles.arrowBtn}
                onClick={() => setDescOpen(v => !v)}
                aria-expanded={descOpen}
              >
                <span className={`${styles.arrow}${descOpen ? ` ${styles.arrowOpen}` : ''}`}>▼</span>
              </button>
            </div>
            {descOpen && (
              <div className={styles.detailPanel}>
                <p>{description || 'No description available.'}</p>
              </div>
            )}
          </div>

          {/* Specs accordion */}
          <div className={`${styles.detailSection} ${styles.specs}`}>
            <div className={styles.detailHead}>
              <span>Specification</span>
              <button
                className={styles.arrowBtn}
                onClick={() => setSpecOpen(v => !v)}
                aria-expanded={specOpen}
              >
                <span className={`${styles.arrow}${specOpen ? ` ${styles.arrowOpen}` : ''}`}>▼</span>
              </button>
            </div>
            {specOpen && (
              <div className={styles.detailPanel}>
                <p className={styles.typeLine}><strong>Type:</strong> {category || '—'}</p>
                <h4>Collection Details</h4>
                <ul>
                  {(Array.isArray(specs) ? specs : specs.split('|')).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {extra && (
            <div className={styles.additionalInfo}>
              <h4>Additional Information</h4>
              <p>{extra}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
