import { useState, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favOpen, setFavOpen]   = useState(false)
  const [search,  setSearch]    = useState('')
  const navigate = useNavigate()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <>
      <nav className="navbar">
        {/* Hamburger menu */}
        <div className="menu-wrap">
          <button
            type="button"
            className={`menu-btn${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>

          <div className={`menu-dropdown${menuOpen ? ' open' : ''}`} role="menu">
            <button
              type="button"
              className="menu-close-btn"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >×</button>
            <NavLink to="/about"    role="menuitem" onClick={closeMenu}>About</NavLink>
            <NavLink to="/services" role="menuitem" onClick={closeMenu}>Services</NavLink>
            <NavLink to="/products" role="menuitem" onClick={closeMenu}>Collections</NavLink>
            <NavLink to="/contact"  role="menuitem" onClick={closeMenu}>Contact</NavLink>
          </div>
        </div>

        {/* Logo */}
        <Link className="logo-wrapper" to="/" aria-label="Go to home page">
          <img src="/slides/pictures/logo-removebg-preview.png" alt="SSV Logo" className="navbar-logo" loading="lazy" />
          <span className="logo">SSV JEWELLERS</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Collections</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search jewellery"
          />
        </form>

        {/* Favourites */}
        <div className="nav-tools" aria-label="Favourites tools">
          <button
            type="button"
            className="tool-btn"
            onClick={() => setFavOpen(v => !v)}
            aria-label="Open liked collections"
          >
            <i className="bi bi-heart" aria-hidden="true" />
          </button>
          <div className={`nav-fav-panel${favOpen ? ' open' : ''}`} aria-hidden={!favOpen}>
            <div className="nav-fav-header">
              <h4>Liked Collections</h4>
              <button className="nav-fav-close" onClick={() => setFavOpen(false)}>×</button>
            </div>
            <p className="nav-fav-empty">No liked collections yet.</p>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`menu-backdrop${menuOpen ? ' open' : ''}`}
        aria-hidden="true"
        onClick={closeMenu}
      />
    </>
  )
}
