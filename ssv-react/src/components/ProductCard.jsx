import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

  const {
    id,
    name,
    category,
    price,
    product_image,
    sku,
  } = product

  const imgSrc = product_image
    ? (product_image.startsWith('http') ? product_image : `/uploads/${product_image}`)
    : '/slides/pictures/logo.jpeg'

  return (
    <div
      className={styles.card}
      data-category={category}
      onClick={() => navigate(`/products/${id}`)}
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
