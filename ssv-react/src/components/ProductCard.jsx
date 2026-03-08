import { useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onClick }) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const {
    id,
    name,
    category,
    price,
    image,
    product_image,
    sku,
  } = product

  const liked = isFavorite(id)

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
          onClick={e => { e.stopPropagation(); toggleFavorite({ id, name, image: imgSrc }) }}
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
