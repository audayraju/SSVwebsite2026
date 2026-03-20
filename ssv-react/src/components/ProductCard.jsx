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
        <button
          className={`${styles.likeBtn}${liked ? ` ${styles.liked}` : ''}`}
          onClick={e => { e.stopPropagation(); toggleFavorite({ id, name, image: imgSrc }) }}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <i className={liked ? 'bi bi-heart-fill' : 'bi bi-heart'} aria-hidden="true" />
        </button>
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
      </div>
    </div>
  )
}
