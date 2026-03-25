import { useState } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { useNavigate } from 'react-router-dom'
// import { uploadsUrl } from '../lib/api'
import styles from './ProductCard.module.css'

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


  // Use backend API endpoint for images
  const imgSrc = product && product._id
    ? `https://api-vert.vercel.app/api/products/${product._id}/image`
    : '/slides/pictures/logo.jpeg'

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
        />
      </div>

      <div className={styles.footer}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.actionsRow}>
          <button
            className={styles.detailsBtn}
            type="button"
            onClick={e => {
              e.stopPropagation()
              openDetails()
            }}
            aria-label={`View details for ${name}`}
          >
            View Details
          </button>

          <button
            className={`${styles.likeBtn}${liked ? ` ${styles.liked}` : ''}${heartPop ? ` ${styles.pop}` : ''}`}
            onClick={e => {
              e.stopPropagation()
              toggleFavorite({ id, name, image: imgSrc })
              setHeartPop(false)
              requestAnimationFrame(() => setHeartPop(true))
            }}
            onAnimationEnd={() => setHeartPop(false)}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
