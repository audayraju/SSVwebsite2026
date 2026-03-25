import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { AdminSidebar } from './AdminDashboard'
import { apiUrl } from '../lib/api'
import styles from './Admin.module.css'

export default function ProductList() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [deleting, setDeleting] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const token = sessionStorage.getItem('ssv_admin_token')
      const r = await axios.get(apiUrl('/api/admin/products'), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(r.data ?? [])
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeleting(id)
    try {
      const token = sessionStorage.getItem('ssv_admin_token')
      await axios.delete(apiUrl(`/api/admin/products/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  function handleEdit(id) {
    navigate(`/admin/upload?edit=${id}`)
  }

  function handleLogout() {
    sessionStorage.removeItem('ssv_admin_token')
    navigate('/admin')
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | SSV Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.adminLayout}>
        <AdminSidebar onLogout={handleLogout} active="manageproducts" />

        <main className={styles.mainContent}>
          <section className={styles.savedProductsSection} aria-labelledby="savedProductsHeading">
            <div className={styles.savedProductsHead}>
              <h2
                id="savedProductsHeading"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                Saved Products
              </h2>
              <p style={{ color: '#888', fontSize: '0.88rem' }}>
                {products.length} product{products.length !== 1 ? 's' : ''} in catalog
              </p>
            </div>

            {loading && (
              <p style={{ color: '#888', padding: '16px 0' }}>Loading products…</p>
            )}

            {!loading && error && (
              <p style={{ color: '#c62828', padding: '16px 0' }}>
                {error}{' '}
                <button
                  onClick={loadProducts}
                  style={{ background: 'none', border: 'none', color: '#560537', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Retry
                </button>
              </p>
            )}

            {!loading && !error && products.length === 0 && (
              <p style={{ color: '#888', padding: '16px 0' }}>No products found. Add your first product!</p>
            )}

            {!loading && !error && products.length > 0 && (
              <ul className={styles.productsList} aria-label="Saved products">
                {products.map(product => (
                  <li key={product.id} className={styles.productItem}>
                    <div className={styles.productItemImage}>
                      {product.image ? (
                        <img
                          src={(product.image.startsWith('http') || product.image.startsWith('data:')) ? product.image : `/uploads/${product.image}`}
                          alt={product.name}
                          loading="lazy"
                          width={64}
                          height={64}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }}
                        />
                      ) : (
                        <div className={styles.productItemImagePlaceholder}>No img</div>
                      )}
                    </div>

                    <div className={styles.productItemInfo}>
                      <span className={styles.productItemName}>{product.name}</span>
                      <span className={styles.productItemMeta}>
                        <span className={styles.productItemCategory}>{product.category}</span>
                        {product.price && (
                          <span className={styles.productItemPrice}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </span>
                      {product.imageId && (
                        <span className={styles.productItemMeta}>
                          Image ID: <strong>{product.imageId}</strong>
                        </span>
                      )}
                    </div>

                    <div className={styles.productItemActions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(product.id)}
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        aria-label={`Delete ${product.name}`}
                      >
                        {deleting === product.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  )
}
