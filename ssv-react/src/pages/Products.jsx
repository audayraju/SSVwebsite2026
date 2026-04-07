import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Products.module.css';

const PRODUCTS_PER_PAGE = 12;

const CATEGORIES = [
    "All",
    "Bangles",
    "Bracelets",
    "Chains",
    "Lockets",
    "Mala",
    "Necklaces",
    "Rose Gold and Auntiq",
    "Tops",
    "Vadanam"
];

const normalizeCategory = (value = '') => {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'malas') return 'mala';
    if (normalized === 'locket') return 'lockets';
    return normalized;
};

import { products as productList } from '../data/productData';

const products = productList;

export default function Products() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Extract category and search query from URL
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    const searchTerm = searchParams.get('search') || '';

    // Initialize category with URL param if it exists, otherwise "All"
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");

    // Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Synchronize state if URL changes (e.g. clicking a link while already on the page)
    React.useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [categoryFromUrl]);

    const filteredProducts = products.filter(p => {
        const normalizedSelectedCategory = normalizeCategory(selectedCategory);
        const normalizedProductCategory = normalizeCategory(p.category);
        const matchesCategory = selectedCategory === "All" || normalizedProductCategory === normalizedSelectedCategory;

        if (!searchTerm) return matchesCategory;

        const searchTokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);

        const matchesSearch = searchTokens.every(token => {
            const matchName = p.name.toLowerCase().split(/[\s-]+/).some(word => word.startsWith(token));
            const matchCat = p.category.toLowerCase().split(/[\s-]+/).some(word => word.startsWith(token));
            const matchDesc = p.description ? p.description.toLowerCase().split(/[\s-]+/).some(word => word.startsWith(token)) : false;
            return matchName || matchCat || matchDesc;
        });

        return matchesCategory && matchesSearch;
    });

    // Show all filtered products (removed pagination since Load More button is gone)
    const visibleProducts = filteredProducts;

    // Group products by category for mobile collections view
    const productsByCategory = {};
    products.forEach(product => {
        if (!productsByCategory[product.category]) {
            productsByCategory[product.category] = [];
        }
        productsByCategory[product.category].push(product);
    });

    return (
        <div className={styles.productsPage}>
            {/* ── PRODUCTS HERO ── */}
            <section className={styles.productsHero}>
                <div className={styles.heroContent}>
                    <span className={styles.heroLabel}>Our Collection</span>
                    <h1><span className={styles.goldText}>Exquisite</span> Jewellers</h1>
                    <p>Explore our curated catalog of handcrafted gold, silver, and diamond masterpieces, each designed to capture the essence of elegance.</p>
                </div>
                <div className={styles.heroGlow} />
            </section>

            <div className={styles.contentWrapper}>
                {/* Category Filter Pills */}
                <div className={styles.filterSection}>
                    <div className={styles.categoryFilter}>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    if (location.search) {
                                        navigate('/products', { replace: true });
                                    }
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProducts.length > 0 ? (
                    <>
                        <div className={styles.productsGrid}>
                            {visibleProducts.map((product, index) => (
                                <div key={product.id} className={styles.productCard}>
                                    <Link to={`/products/${product.id}`} className={styles.imageLink}>
                                        <div className={styles.imageContainer}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className={styles.productImage}
                                                loading={index < 4 ? 'eager' : 'lazy'}
                                                decoding="async"
                                                fetchPriority={index < 4 ? 'high' : 'low'}
                                            />
                                        </div>
                                    </Link>
                                    <div className={styles.productInfo}>
                                        <div className={styles.infoTop}>
                                            <span className={styles.productCategory}>{product.category}</span>
                                            <span className={styles.productSku}>{product.sku}</span>
                                        </div>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <div className={styles.infoBottom}>
                                            <p className={styles.productPrice}>{product.price || product.GMS || 'Contact for price'}</p>
                                            <Link to={`/products/${product.id}`} className={styles.enquireLink}>
                                                Enquire
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles.noResults}>
                        <h3>No matches found for "{searchTerm}"</h3>
                        <p>Try exploring our featured categories or adjust your search.</p>
                        <button onClick={() => navigate('/products')} className={styles.resetBtn}>View All Products</button>
                    </div>
                )}
            </div>
        </div>
    );
}
