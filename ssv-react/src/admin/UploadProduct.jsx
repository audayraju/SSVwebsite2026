
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import { AdminSidebar } from './AdminDashboard'
import { apiUrl, uploadsUrl } from '../lib/api'
import styles from './Admin.module.css'

const CATEGORIES = [
  { value: 'ring', label: 'Rings' },
  { value: 'necklace', label: 'Necklaces' },
  { value: 'bracelet', label: 'Bracelets' },
  { value: 'earring', label: 'Earrings' },
  { value: 'chain', label: 'Chains' },
]

const EMPTY = {
  productName: '',
  productCategory: '',
  productPrice: '',
  productDescription: '',
  productAdditionalInfo: '',
  productType: '',
  productSpecs: '',
  productImageId: '',
}

export default function UploadProduct() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState({ msg: '', ok: true })
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  // Pre-fill form when editing
  useEffect(() => {
    if (!editId) return
    const token = sessionStorage.getItem('ssv_admin_token')
    axios.get(apiUrl(`/api/admin/products/${editId}`), {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      const p = r.data
      setForm({
        productName: p.name ?? '',
        productCategory: p.category ?? '',
        productPrice: p.price ?? '',
        productDescription: p.description ?? '',
        productAdditionalInfo: p.additionalInfo ?? '',
        productType: p.type ?? '',
        productSpecs: Array.isArray(p.specs) ? p.specs.join('\n') : (p.specs ?? ''),
        productImageId: p.imageId ?? '',
      })
      if (p.image) setPreview(p.image.startsWith('data:') || p.image.startsWith('http') ? p.image : uploadsUrl(p.image))
    }).catch(() => {
      setStatus({ msg: 'Failed to load product for editing.', ok: false })
    })
  }, [editId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setStatus({ msg: '', ok: true })

    try {
      const token = sessionStorage.getItem('ssv_admin_token')
      let imageBase64 = null
      let imageContentType = null
      if (imageFile) {
        // Read file as base64
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(imageFile)
        })
        // fileData is a data URL: "data:image/jpeg;base64,..."
        const [meta, base64] = String(fileData).split(',')
        imageBase64 = base64
        imageContentType = imageFile.type
      }

      const payload = {
        ...form,
        imageBase64,
        imageContentType,
      }

      const url = editId ? apiUrl(`/api/admin/products/${editId}`) : apiUrl('/api/admin/products')
      const method = editId ? 'put' : 'post'

      await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      setStatus({ msg: editId ? 'Product updated successfully!' : 'Product saved successfully!', ok: true })
      if (!editId) {
        setForm(EMPTY)
        setImageFile(null)
        setPreview(null)
        if (fileRef.current) fileRef.current.value = ''
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message
        ?? (err?.response?.status ? `Save failed (HTTP ${err.response.status}).` : null)
        ?? err?.message
        ?? 'Failed to save product. Please try again.'
      // keep a full console trace for debugging while showing a readable UI message
      console.error('UploadProduct save failed:', err)
      setStatus({ msg, ok: false })
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('ssv_admin_token')
    navigate('/admin')
  }

  return (
    <>
      <Helmet>
        <title>{editId ? 'Edit Product' : 'Add Product'} | SSV Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.adminLayout}>
        <AdminSidebar onLogout={handleLogout} active="addproduct" />

        <main className={styles.mainContent}>
          <section className={styles.formCard} aria-labelledby="addProductHeading">
            <header className={styles.cardHead}>
              <div className={styles.cardHeadTop}>
                <h2 id="addProductHeading" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                  {editId ? 'Edit Product' : 'Add Product'}
                </h2>
              </div>
              <p style={{ color: '#888', fontSize: '0.88rem' }}>
                {editId ? 'Update product details below.' : 'Add a new item to your catalog quickly.'}
              </p>
            </header>

            <form className={styles.productForm} onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productImage">Product Image</label>
                <input
                  type="file"
                  id="productImage"
                  ref={fileRef}
                  accept="image/png,image/jpeg,image/webp"
                  className={styles.hiddenFileInput}
                  onChange={handleFile}
                />
                <label
                  htmlFor="productImage"
                  className={styles.uploadBox}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                >
                  {preview ? (
                    <img src={preview} alt="Selected product preview" className={styles.uploadPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon} aria-hidden="true">⬆</span>
                      <span className={styles.uploadText}>Click to upload product image</span>
                      <span className={styles.uploadNote}>PNG, JPG, WEBP</span>
                    </>
                  )}
                </label>
              </div>

              {/* Name */}
              <div className={styles.fieldGroup}>
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="productImageId">Image ID Number</label>
                <input
                  type="text"
                  id="productImageId"
                  name="productImageId"
                  value={form.productImageId}
                  onChange={handleChange}
                  placeholder="Auto if empty (e.g. 12 or IMG-000012)"
                />
              </div>

              {/* Category */}
              <div className={styles.fieldGroup}>
                <label htmlFor="productCategory">Category</label>
                <select
                  id="productCategory"
                  name="productCategory"
                  value={form.productCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productPrice">Price (₹)</label>
                <input
                  type="number"
                  id="productPrice"
                  name="productPrice"
                  value={form.productPrice}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Description */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productDescription">Description</label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={form.productDescription}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a short product description..."
                />
              </div>

              {/* Additional Info */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productAdditionalInfo">Additional Information</label>
                <textarea
                  id="productAdditionalInfo"
                  name="productAdditionalInfo"
                  value={form.productAdditionalInfo}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add extra details (making charges, availability, etc.)"
                />
              </div>

              {/* Type */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productType">Product Type</label>
                <input
                  type="text"
                  id="productType"
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  placeholder="e.g. Gold Necklace Set"
                />
              </div>

              {/* Specs */}
              <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                <label htmlFor="productSpecs">Specifications (one per line)</label>
                <textarea
                  id="productSpecs"
                  name="productSpecs"
                  value={form.productSpecs}
                  onChange={handleChange}
                  rows={4}
                  placeholder={'Hallmark Certified\nHandcrafted Finish'}
                />
              </div>

              {/* Status message */}
              {status.msg && (
                <p
                  className={styles.formStatus}
                  role="status"
                  aria-live="polite"
                  style={{ color: status.ok ? '#2e7d32' : '#c62828' }}
                >
                  {status.msg}
                </p>
              )}

              {/* Actions */}
              <div className={`${styles.formActions} ${styles.fieldFull}`}>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving…' : editId ? 'Update Product' : 'Save / Add Product'}
                </button>
                {editId && (
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => navigate('/admin/products')}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>
        </main>
      </div>
    </>
  )
}
