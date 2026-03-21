import { useState, useCallback, useEffect } from 'react'
import { useFavorites } from '../context/FavoritesContext'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { favorites, removeFavorite } = useFavorites()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeFav = useCallback(() => setFavOpen(false), [])
  const closePanels = useCallback(() => {
    setMenuOpen(false)
    setFavOpen(false)
  }, [])

  /* Auto-typing placeholder suggestions for the search box */
  const suggestions = ['our products', 'rings', 'necklaces', 'earrings', 'bracelets', 'wedding sets']
  const [suggestIndex, setSuggestIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [typing, setTyping] = useState(true)
  const [placeholderText, setPlaceholderText] = useState('Search...')

  useEffect(() => {
    if (search) {
      setPlaceholderText('')
      return
    }

    let mounted = true
    const word = suggestions[suggestIndex]

    // typing forward
    if (typing && charIndex < word.length) {
      const t = setTimeout(() => {
        if (!mounted) return
        setCharIndex(ci => ci + 1)
        setPlaceholderText(word.slice(0, charIndex + 1))
      }, 100)
      return () => { mounted = false; clearTimeout(t) }
    }

    // pause at end of word
    if (typing && charIndex === word.length) {
      const t = setTimeout(() => {
        if (!mounted) return
        setTyping(false)
      }, 1400)
      return () => { mounted = false; clearTimeout(t) }
    }

    // deleting
    if (!typing && charIndex > 0) {
      const t = setTimeout(() => {
        if (!mounted) return
        setCharIndex(ci => ci - 1)
        setPlaceholderText(word.slice(0, charIndex - 1))
      }, 60)
      return () => { mounted = false; clearTimeout(t) }
    }

    // move to next word
    if (!typing && charIndex === 0) {
      const t = setTimeout(() => {
        if (!mounted) return
        setTyping(true)
        setSuggestIndex(i => (i + 1) % suggestions.length)
      }, 400)
      return () => { mounted = false; clearTimeout(t) }
    }
  }, [charIndex, typing, suggestIndex, search])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  function scrollToTopNow() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="top-mini-bar" role="navigation" aria-label="Top quick links">
        <div className="top-mini-inner">
          <div className="top-pill">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ssvjewllers@gmail.com&su=Enquiry%20from%20Website&body=Hi%20SSV%20Jewellers%2C%0A%0AI%20am%20interested%20in%20your%20collections.%20Please%20share%20more%20details.%0A%0AThank%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="top-pill-item mini-item"
              aria-label="Email SSV Jewellers via Gmail"
            >
              ✉️ ssvjewellers@gmail.com
            </a>
            <a href="/contact#store-map" className="top-pill-item mini-item" aria-label="Visit store location">
              📍 Visit Store
            </a>
            <a href="tel:+919876543211" className="top-pill-item mini-item" aria-label="Call now">
              📞 Call Now 9874563210
            </a>
          </div>
        </div>
      </div>


      <nav className="navbar">
        {/* Hamburger menu */}
        <div className="menu-wrap">
          <button
            type="button"
            className={`menu-btn${menuOpen ? ' open' : ''}`}
            onClick={() => {
              setFavOpen(false)
              setMenuOpen(v => !v)
            }}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 6 }}
          >
            {/* Use stroked lines so they remain visible on any background */}
            <svg className="menu-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <line x1="4" y1="7" x2="20" y2="7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="4" y1="17" x2="20" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className={`menu-dropdown${menuOpen ? ' open' : ''}`} role="menu">
            <button
              type="button"
              className="menu-close-btn"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >×</button>
            <NavLink to="/about" role="menuitem" onClick={closeMenu}>About</NavLink>
            <NavLink to="/services" role="menuitem" onClick={closeMenu}>Services</NavLink>
            <NavLink to="/products" role="menuitem" onClick={() => { closeMenu(); scrollToTopNow() }}>Collections</NavLink>
            <NavLink to="/contact" role="menuitem" onClick={() => { closeMenu(); scrollToTopNow() }}>Contact</NavLink>
          </div>
        </div>

        {/* Logo */}
        <Link className="logo-wrapper" to="/" aria-label="Go to home page">
          <img src="/slides/pictures/logo-removebg-preview.png" alt="SSV Logo" className="navbar-logo" loading="lazy" />
          <span className="logo">SSV JEWELLERS</span>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollToTopNow}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollToTopNow}>Collections</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={scrollToTopNow}>Contact</NavLink>
        </div>

        {/* Favourites + Search grouped on the right */}
        <div className="nav-tools" aria-label="Favourites tools">
          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={search ? '' : placeholderText}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search jewellery"
            />
          </form>
          <button
            type="button"
            className="tool-btn fav-btn"
            onClick={() => {
              setMenuOpen(false)
              setFavOpen(v => !v)
            }}
            aria-label="Open liked collections"
          >
            <i className="bi bi-heart" aria-hidden="true" />
            {favorites.length > 0 && (
              <span className="tool-count" aria-hidden="true">{favorites.length}</span>
            )}
          </button>

          <div className={`nav-fav-panel${favOpen ? ' open' : ''}`} aria-hidden={!favOpen}>
            <div className="nav-fav-header">
              <h4>Liked Collections</h4>
              <button className="nav-fav-close" onClick={closeFav}>×</button>
            </div>
            {favorites.length === 0 ? (
              <p className="nav-fav-empty">No liked collections yet.</p>
            ) : (
              <div className="nav-fav-list">
                {favorites.map(item => (
                  <div
                    className="nav-fav-item"
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => { navigate(`/products/${item.id}`); closeFav(); }}
                    onKeyDown={e => { if (e.key === 'Enter') { navigate(`/products/${item.id}`); closeFav(); } }}
                  >
                    <img src={item.image || '/slides/pictures/logo.jpeg'} alt={item.name} />
                    <div className="nav-fav-meta">
                      <div className="nav-fav-name">{item.name}</div>
                      <button className="nav-fav-remove" onClick={e => { e.stopPropagation(); removeFavorite(item.id); }} aria-label={`Remove ${item.name}`}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`menu-backdrop${menuOpen || favOpen ? ' open' : ''}`}
        aria-hidden="true"
        onClick={closePanels}
      />
    </>
  )
}
