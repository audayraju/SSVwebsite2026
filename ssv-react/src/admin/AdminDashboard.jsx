import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import styles from './Admin.module.css'

const QUICK_LINKS = [
  { to: '/admin/upload',   icon: '➕', title: 'Add Product',   desc: 'Upload images and add new products to your catalog.' },
  { to: '/admin/products', icon: '📦', title: 'Manage Products', desc: 'Edit or delete existing products in your catalog.' },
  { to: '/',               icon: '🌐', title: 'View Website',   desc: 'Open the live website in a new tab.' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('ssv_admin_token')
    navigate('/admin')
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | SSV Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={styles.adminLayout}>
        <AdminSidebar onLogout={handleLogout} active="dashboard" />

        <main className={styles.mainContent}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', marginBottom: 8, color: '#1a1a1a' }}>Dashboard</h2>
          <p style={{ color: '#888', marginBottom: 28, fontSize: '0.88rem' }}>Welcome back to SSV Admin Panel.</p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNum}>—</div>
              <div className={styles.statLabel}>Total Products</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNum}>—</div>
              <div className={styles.statLabel}>Categories</div>
            </div>
          </div>

          <div className={styles.quickLinks}>
            {QUICK_LINKS.map(link => (
              <Link key={link.to} to={link.to} className={styles.quickLink}
                target={link.title === 'View Website' ? '_blank' : undefined}
                rel={link.title === 'View Website' ? 'noopener noreferrer' : undefined}
              >
                <span className={styles.quickLinkIcon}>{link.icon}</span>
                <span className={styles.quickLinkTitle}>{link.title}</span>
                <span className={styles.quickLinkDesc}>{link.desc}</span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export function AdminSidebar({ onLogout, active }) {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/upload',    label: 'Add Product' },
    { to: '/admin/products',  label: 'Manage Products' },
  ]

  return (
    <aside className={styles.sidebar} aria-label="Admin navigation">
      <div className={styles.brandWrap}>
        <h1 className={styles.brand}>SSV Admin</h1>
        <p className={styles.brandSub}>Dashboard Panel</p>
      </div>

      <nav>
        <ul className={styles.menu}>
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={`${styles.menuLink}${active === l.label.toLowerCase().replace(' ', '') ? ` ${styles.menuLinkActive}` : ''}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button className={styles.logoutBtn} onClick={onLogout}>Sign Out</button>
    </aside>
  )
}
