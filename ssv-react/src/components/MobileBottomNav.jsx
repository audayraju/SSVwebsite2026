import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './MobileBottomNav.module.css';

const MobileBottomNav = () => {
    const location = useLocation();

    return (
        <nav className={styles.bottomNav}>
            <NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <i className="bi bi-house-door"></i>
                <span>Home</span>
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `${styles.navItem} ${isActive && !location.search.includes('search') ? styles.active : ''}`}>
                <i className="bi bi-gem"></i>
                <span>Collection</span>
            </NavLink>
            <NavLink to="/products?search=" className={({ isActive }) => `${styles.navItem} ${location.search.includes('search') ? styles.active : ''}`}>
                <i className="bi bi-search"></i>
                <span>Search</span>
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <i className="bi bi-envelope"></i>
                <span>Contact</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <i className="bi bi-person"></i>
                <span>About</span>
            </NavLink>
        </nav>
    );
};

export default MobileBottomNav;
