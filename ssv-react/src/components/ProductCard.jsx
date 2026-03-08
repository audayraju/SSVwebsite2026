import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onClick }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

  const {
    id,
    name,
    category,
    price,
    image,
    product_image,
    sku,
  } = product

  const imgSrc = (image || product_image)
    ? (() => {
        const src = image || product_image
        if (src.startsWith('http') || src.startsWith('data:')) return src
        return `/uploads/${src}`
      })()
    : '/slides/pictures/logo.jpeg'

  return (
    <div
      className={styles.card}
      data-category={category}
      onClick={() => onClick ? onClick() : navigate(`/products/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/products/${id}`)}
      aria-label={`View ${name}`}
    >
      <div className={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={name}
          className={styles.img}
          loading="lazy"
        />
        <button
          className={`${styles.likeBtn}${liked ? ` ${styles.liked}` : ''}`}
          onClick={e => { e.stopPropagation(); setLiked(v => !v) }}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        {sku && <p className={styles.sku}>{sku}</p>}
        {price && <p className={styles.price}>{price}</p>}
        <span className={styles.badge}>{category}</span>
      </div>
    </div>
  )
}
