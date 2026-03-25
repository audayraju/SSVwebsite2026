import { useState } from 'react'

import { useFavorites } from '../context/FavoritesContext'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCardCustom.module.css'


// Modern e-commerce product card for collections page
export default function ProductCard({ product, onClick }) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [heartPop, setHeartPop] = useState(false)
  const {
    id,
    name,
    category,
    image,
    product_image,
  } = product

  const liked = isFavorite(id)
  const openDetails = () => {
    if (onClick) {
      onClick()
      return
    }
    navigate(`/products/${id}`)
  }

  // Improved image src logic: prefer absolute, fallback to /uploads, fallback to logo
  let imgSrc = image || product_image || ''
  if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) {
    // absolute or data url
  } else if (imgSrc) {
    imgSrc = `/uploads/${imgSrc.replace(/^\/+/, '')}`
  } else {
    imgSrc = '/slides/pictures/logo.jpeg'
  }


  // Modern card layout (Tailwind CSS)
  return (
    <div
      className={styles.card}
      data-category={category}
      onClick={openDetails}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openDetails()
        }
      }}
      aria-label={`View ${name}`}
    >
      <div className={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={name}
          className={styles.img}
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = '/slides/pictures/logo.jpeg'; }}
        />
        <button
          className={styles.heartBtn}
          onClick={e => {
            e.stopPropagation()
            toggleFavorite({ id, name, image: imgSrc })
            setHeartPop(false)
            requestAnimationFrame(() => setHeartPop(true))
          }}
          onAnimationEnd={() => setHeartPop(false)}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" style={{ width: 24, height: 24, color: liked ? '#c59d5f' : '#bbb' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" /></svg>
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.name}>{name}</div>
        <div className={styles.sku}>{product.sku || ''}</div>
        {product.price && (
          <div className={styles.price}>{product.price}</div>
        )}
        <span className={styles.badge}>{category}</span>
      </div>
    </div>
  )

}
