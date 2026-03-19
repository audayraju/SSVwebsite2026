import { useEffect, useRef, useState } from 'react'
import { productImageUrl } from '../lib/api'
import styles from './ProductModal.module.css'

export default function ProductModal({ product, onClose }) {
  const [descOpen, setDescOpen] = useState(true)
  const [specOpen, setSpecOpen] = useState(true)
  const [zoomed,       setZoomed]       = useState(false)
  const [viewerZoomed, setViewerZoomed] = useState(false)
  const [viewerOrigin, setViewerOrigin] = useState('center center')
  const [translate,    setTranslate]    = useState({ x: 0, y: 0 })
  const [isDragging,   setIsDragging]   = useState(false)
  const dragRef = useRef({ active: false, startX: 0, startY: 0, tx: 0, ty: 0, moved: false })

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        if (viewerZoomed) {
          setViewerZoomed(false)
          setViewerOrigin('center center')
          setTranslate({ x: 0, y: 0 })
          return
        }
        if (zoomed) { setZoomed(false); return }
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, zoomed, viewerZoomed])

  const {
    name, sku, price, description, specs = [], extra, category,
    image, product_image,
  } = product

  const _img   = image || product_image
  const imgSrc = _img
    ? productImageUrl(_img)
    : '/logo.png'

  const waMsg  = encodeURIComponent(`Hi, I'm interested in ${name}${sku ? ` (SKU: ${sku})` : ''}. Could you share more details?`)
  const waLink = `https://wa.me/916281049201?text=${waMsg}`

  function openViewer() {
    setViewerZoomed(false)
    setViewerOrigin('center center')
    setTranslate({ x: 0, y: 0 })
    setZoomed(true)
  }

  function handleViewerClick(e) {
    if (dragRef.current.moved) return  // don't toggle zoom after a drag
    if (!viewerZoomed) {
      const rect = e.currentTarget.getBoundingClientRect()
      const xPct = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2)
      const yPct = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2)
      setViewerOrigin(`${xPct}% ${yPct}%`)
      setTranslate({ x: 0, y: 0 })
      setViewerZoomed(true)
    } else {
      setViewerZoomed(false)
      setViewerOrigin('center center')
      setTranslate({ x: 0, y: 0 })
    }
  }

  function handlePointerDown(e) {
    if (!viewerZoomed) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, tx: translate.x, ty: translate.y, moved: false }
    setIsDragging(true)
  }

  function handlePointerMove(e) {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    setTranslate({ x: dragRef.current.tx + dx, y: dragRef.current.ty + dy })
  }

  function handlePointerUp() {
    dragRef.current.active = false
    setIsDragging(false)
  }

  const specList = Array.isArray(specs)
    ? specs
    : String(specs).split('|').map(s => s.trim()).filter(Boolean)

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close">&#xd7;</button>

        {/* LEFT column: image */}
        <div className={styles.left}>
          <div
            className={styles.imgWrap}
            onClick={() => openViewer()}
            title="Click to enlarge"
          >
            <img src={imgSrc} alt={name} className={styles.img} loading="lazy" />
            <span className={styles.zoomHint} aria-hidden="true">&#x1f50d; Click to zoom</span>
          </div>
        </div>

        {/* RIGHT column: product info */}
        <div className={styles.right}>
          {category && <p className={styles.categoryTag}>{category}</p>}
          <h2 id="modalTitle" className={styles.title}>{name}</h2>
          {sku && <p className={styles.sku}>SKU: <span>{sku}</span></p>}

          {price && (
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.price}>{price}</span>
            </div>
          )}

          <a href={waLink} className={styles.waBtn} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.525 4.004 1.447 5.699L0 24l6.445-1.428A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.502-5.18-1.38l-.37-.22-3.826.848.859-3.742-.242-.385A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Enquire on WhatsApp
          </a>

          <div className={styles.divider} />

          {/* Description accordion */}
          <div className={styles.accordion}>
            <button className={styles.accHead} onClick={() => setDescOpen(v => !v)} aria-expanded={descOpen}>
              <span>Description</span>
              <span className={`${styles.accArrow}${descOpen ? ' ' + styles.accArrowOpen : ''}`}>&#x25bc;</span>
            </button>
            {descOpen && (
              <div className={styles.accPanel}>
                <p>{description || 'Handcrafted with finest quality materials.'}</p>
              </div>
            )}
          </div>

          {/* Product details accordion */}
          {(specList.length > 0 || category) && (
            <div className={styles.accordion}>
              <button className={styles.accHead} onClick={() => setSpecOpen(v => !v)} aria-expanded={specOpen}>
                <span>Product Details</span>
                <span className={`${styles.accArrow}${specOpen ? ' ' + styles.accArrowOpen : ''}`}>&#x25bc;</span>
              </button>
              {specOpen && (
                <div className={styles.accPanel}>
                  <table className={styles.specTable}>
                    <tbody>
                      {category && (
                        <tr><td>Type</td><td>{category}</td></tr>
                      )}
                      {specList.map((s, i) => {
                        const colonIdx = s.indexOf(':')
                        if (colonIdx > 0) {
                          const label = s.slice(0, colonIdx).trim()
                          const val   = s.slice(colonIdx + 1).trim()
                          return <tr key={i}><td>{label}</td><td>{val}</td></tr>
                        }
                        return <tr key={i}><td colSpan={2}>{s}</td></tr>
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {extra && (
            <div className={styles.extraBox}>
              <p>{extra}</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div
          className={styles.lightbox}
          onClick={() => {
            if (viewerZoomed) {
              setViewerZoomed(false)
              setViewerOrigin('center center')
              setTranslate({ x: 0, y: 0 })
            } else setZoomed(false)
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed image"
          aria-hidden={!zoomed}
        >
          <button
            className={styles.lightboxClose}
            onClick={e => { e.stopPropagation(); setZoomed(false) }}
            aria-label="Close"
          >&#xd7;</button>
          <p className={styles.lightboxHint}>
            {viewerZoomed ? 'Drag to pan · Click to zoom out' : 'Click image to zoom in'}
          </p>
          <img
            src={imgSrc}
            alt={name}
            className={styles.lightboxImg}
            draggable={false}
            style={{
              transformOrigin: viewerOrigin,
              transform: viewerZoomed
                ? `translate(${translate.x}px, ${translate.y}px) scale(3)`
                : 'scale(1)',
              cursor: viewerZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              transition: isDragging ? 'none' : 'transform 0.35s ease',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={e => { e.stopPropagation(); handleViewerClick(e) }}
          />
        </div>
      )}
    </div>
  )
}
