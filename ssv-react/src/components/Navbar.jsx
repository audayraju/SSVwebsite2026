import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const [search, setSearch] = useState('');
  const [placeholderText, setPlaceholderText] = useState('Search...');
  const [suggestIndex, setSuggestIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const suggestions = ['our products', 'rings', 'necklaces', 'earrings', 'bracelets', 'wedding sets'];

  const announcementItems = [
    <React.Fragment key="1">
      <strong>NOTE:</strong>  We accept all types of custom designs in Gold and Silver to match your style and preferences.
    </React.Fragment>,
    <React.Fragment key="2">
      <strong>Gold Ornaments:</strong> Gold Wastage Only 8% VA | No Making Charges
    </React.Fragment>,
    <React.Fragment key="3">
      <strong>Silver Ornaments:</strong> Lower and more reasonable prices compared to other markets.
    </React.Fragment>,
  ];

  useEffect(() => {
    if (search || isFocused) {
      setPlaceholderText(search ? '' : 'Search...');
      return;
    }
    let mounted = true;
    const word = suggestions[suggestIndex];
    if (typing && charIndex < word.length) {
      const t = setTimeout(() => {
        if (!mounted) return;
        setCharIndex(ci => ci + 1);
        setPlaceholderText(word.slice(0, charIndex + 1));
      }, 100);
      return () => { mounted = false; clearTimeout(t); };
    }
    if (typing && charIndex === word.length) {
      const t = setTimeout(() => {
        if (!mounted) return;
        setTyping(false);
      }, 1400);
      return () => { mounted = false; clearTimeout(t); };
    }
    if (!typing && charIndex > 0) {
      const t = setTimeout(() => {
        if (!mounted) return;
        setCharIndex(ci => ci - 1);
        setPlaceholderText(word.slice(0, charIndex - 1));
      }, 60);
      return () => { mounted = false; clearTimeout(t); };
    }
    if (!typing && charIndex === 0) {
      const t = setTimeout(() => {
        if (!mounted) return;
        setTyping(true);
        setSuggestIndex(i => (i + 1) % suggestions.length);
      }, 400);
      return () => { mounted = false; clearTimeout(t); };
    }
  }, [charIndex, typing, suggestIndex, search, isFocused]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setSearch(searchParam);
    } else {
      setSearch('');
    }
  }, [location.search]);

  function handleSearchChange(e) {
    const newVal = e.target.value;
    setSearch(newVal);
    // Instant real-time filtering if on products page
    if (location.pathname === '/products') {
      if (newVal.trim() === '') {
        navigate('/products', { replace: true });
      } else {
        navigate(`/products?search=${encodeURIComponent(newVal.trimStart())}`, { replace: true });
      }
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/products');
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const bodyPadding = parseInt(getComputedStyle(document.body).paddingTop, 10) || 100;
    const top = el.getBoundingClientRect().top + window.scrollY - bodyPadding - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function handleContactClick(e) {
    // Keep link semantics but perform SPA-friendly scroll to Home contact section
    e.preventDefault();
    if (window.location.pathname === '/' || window.location.pathname === '') {
      scrollToSection('contact');
      return;
    }
    // navigate home then scroll after a short delay
    navigate('/');
    setTimeout(() => scrollToSection('contact'), 120);
  }


  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (window.location.pathname === href) {
      window.location.reload();
    }
  }

  function handleHomeClick(e) {
    e.preventDefault();
    // If already on home, force a full page reload to refresh content
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.location.reload();
      return;
    }
    navigate('/');
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleMobileToggle() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <div className={`${styles.navbarWrapper} ${styles.themeModern}`}>
      {/* Required fixed announcement at top */}
      <div className="footer-announcement" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10002 }} aria-label="Custom design announcement">
        <div className="footer-announcement__viewport">
          <div className="footer-announcement__track">
            {[0, 1].map(loopIndex => (
              <div
                key={loopIndex}
                className="footer-announcement__group"
                aria-hidden={loopIndex === 1 ? 'true' : undefined}
              >
                <span className="footer-announcement__spacer" aria-hidden="true" />
                {announcementItems.map((item, itemIndex) => (
                  <p key={`${loopIndex}-${itemIndex}`} className="footer-announcement__text">
                    {item}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar Row */}
      <div className={styles.mainNavbarRow}>
        <div className={styles.navInner}>
          <div className={styles.logoSection}>
            <Link className={styles['logo-wrapper']} to="/" aria-label="Go to home page">
              <img src="/slides/pictures/logo-removebg-preview.png" alt="SSV Logo" className={styles.logoImage} />
              <span className={styles.logo}>SSV JEWELLERS</span>
            </Link>
          </div>

          <div className={styles['nav-links']}>
            <a href="/" onClick={handleHomeClick} className={location.pathname === '/' ? styles.active : ''}>Home</a>
            <NavLink onClick={handleNavClick} to="/products" className={({ isActive }) => isActive ? styles.active : ''}>Products</NavLink>
            <NavLink onClick={handleNavClick} to="/contact" className={({ isActive }) => isActive ? styles.active : ''}>Contact</NavLink>

            <div
              className={styles.dropdown}
              ref={moreRef}
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                type="button"
                className={`${styles.dropdownToggle} ${['/about', '/services'].includes(location.pathname) ? styles.active : ''}`}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen(v => !v)}
              >
                More <span aria-hidden="true" className={styles.caret}>▾</span>
              </button>
              <div className={`${styles.dropdownMenu} ${moreOpen ? styles.show : ''}`} role="menu">
                <NavLink onClick={handleNavClick} to="/about" className={({ isActive }) => isActive ? styles.active : ''} role="menuitem">About</NavLink>
                <NavLink onClick={handleNavClick} to="/services" className={({ isActive }) => isActive ? styles.active : ''} role="menuitem">Services</NavLink>
              </div>
            </div>
          </div>

          <div className={styles.searchSection}>
            <button className={styles.mobileMenuBtn} onClick={handleMobileToggle} aria-label="Toggle navigation menu">
              <i className={isMobileMenuOpen ? "bi bi-x-large" : "bi bi-list"}></i>
            </button>
            <form className={styles['search-box']} onSubmit={handleSearch}>
              <i className={`bi bi-search ${styles.searchIcon}`} aria-hidden="true" onClick={() => document.getElementById('navbar-search-input').focus()}></i>
              <input
                id="navbar-search-input"
                type="text"
                placeholder={isFocused ? 'Search...' : (search ? '' : placeholderText)}
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label="Search jewellery"
              />
            </form>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.mobileOverlayOpen : ''}`}>
          <div className={styles.mobileNavLinks}>
            <NavLink to="/" onClick={() => { setIsMobileMenuOpen(false); }} className={({ isActive }) => isActive ? styles.active : ''}>Home</NavLink>
            <NavLink to="/products" onClick={() => { setIsMobileMenuOpen(false); }} className={({ isActive }) => isActive ? styles.active : ''}>Products</NavLink>
            <NavLink to="/contact" onClick={() => { setIsMobileMenuOpen(false); }} className={({ isActive }) => isActive ? styles.active : ''}>Contact</NavLink>
            <NavLink to="/about" onClick={() => { setIsMobileMenuOpen(false); }} className={({ isActive }) => isActive ? styles.active : ''}>About</NavLink>
            <NavLink to="/services" onClick={() => { setIsMobileMenuOpen(false); }} className={({ isActive }) => isActive ? styles.active : ''}>Services</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

