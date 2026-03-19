import { useState } from 'react'
import styles from './ImageGallery.module.css'

export default function ImageGallery({ images = [], alt = 'Product image' }) {
  const [active, setActive] = useState(0)
  const [viewer, setViewer] = useState(false)

  if (!images.length) return null

  return (
    <>
      <div className={styles.gallery}>
        {/* Main image */}
        <div className={styles.main} onClick={() => setViewer(true)}>
          <img
            src={images[active]}
            alt={alt}
            className={styles.mainImg}
            loading="lazy"
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className={styles.thumbs}>
            {images.map((src, i) => (
              <button
                key={i}
                className={`${styles.thumb}${i === active ? ` ${styles.thumbActive}` : ''}`}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt={`${alt} ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox viewer */}
      {viewer && (
        <div
          className={styles.viewer}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setViewer(false)}
        >
          <div className={styles.viewerContent} onClick={e => e.stopPropagation()}>
            <button className={styles.viewerClose} onClick={() => setViewer(false)} aria-label="Close">×</button>
            <img src={images[active]} alt={alt} className={styles.viewerImg} />
          </div>
        </div>
      )}
    </>
  )
}
