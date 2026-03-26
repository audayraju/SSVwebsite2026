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

  const navigate = useNavigate();
  const location = useLocation();
  const suggestions = ['our products', 'rings', 'necklaces', 'earrings', 'bracelets', 'wedding sets'];

  useEffect(() => {
    if (search) {
      setPlaceholderText('');
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
  }, [charIndex, typing, suggestIndex, search]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
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

  function handleHomeClick(e) {
    e.preventDefault();
    // If already on home, force a full page reload to refresh content
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.location.reload();
      return;
    }
    navigate('/');
  }

  return (
    <div className={`${styles.navbarWrapper} ${styles.themeModern}`}>
      {/* Top Pill Bar */}
      <div className={styles.topPillBar}>
        <div className={styles.pillLeft}>
          <div className={styles.pillItem}><span role="img" aria-label="email">✉️</span> ssvjewellers@gmail.com</div>
          <div className={styles.pillItem}><span role="img" aria-label="location">📍</span> Visit Store</div>
        </div>
        <div className={styles.pillRight}>
          <div className={styles.pillItem}><span role="img" aria-label="phone">📞</span> Call Now 9874563210</div>
        </div>
      </div>

      {/* Main Navbar Row: 30/50/20 split */}
      <div className={styles.mainNavbarRow}>
        <div className={styles.logoSection}>
          <Link className={styles['logo-wrapper']} to="/" aria-label="Go to home page">
            <img src="/slides/pictures/logo-removebg-preview.png" alt="SSV Logo" className={styles.logoImage} />
            <span className={styles.logo}>SSV JEWELLERS</span>
          </Link>
          {/* favorites link moved to search section */}
        </div>
        <div className={styles['nav-links']}>
          <a href="/" onClick={handleHomeClick} className={location.pathname === '/' ? 'active' : ''}>Home</a>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
          {/* Contact should scroll to Home#contact instead of opening a separate page */}
          <a href="/#contact" onClick={handleContactClick} className={({ isActive }) => ''}>Contact</a>

          {/* Dropdown grouping About + Services */}
          <div
            className={styles.dropdown}
            ref={moreRef}
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              className={styles.dropdownToggle}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(v => !v)}
            >
              More
              <span aria-hidden="true" className={styles.caret}>▾</span>
            </button>
            <div className={`${styles.dropdownMenu} ${moreOpen ? styles.show : ''}`} role="menu">
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} role="menuitem">About</NavLink>
              <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''} role="menuitem">Services</NavLink>
            </div>
          </div>
        </div>
        <div className={styles.searchSection}>
          <form className={styles['search-box']} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={search ? '' : placeholderText}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search jewellery"
              style={{ width: '100%', maxWidth: '100%' }}
            />
          </form>
          {/* favorites removed from nav */}
        </div>
      </div>

      {/* Nav links moved into main row for single-line layout */}
    </div>
  );
}

