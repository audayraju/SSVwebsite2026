import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Products.module.css';

const CATEGORIES = [
    "All", 
    "Necklaces", 
    "Bangles", 
    "Bracelets", 
    "Rings", 
    "Bridal Sets", 
    "Chokers", 
    "Light Weight Items"
];

const products = [
    { id: 1, name: 'Radha Krishna Haram', sku: 'SSV-HRM-001', price: '₹ 1,89,000', category: 'Necklaces', image: '/images/floral_kundan.png' },
    { id: 2, name: 'Classic Gold Bangles', sku: 'SSV-BNG-002', price: '₹ 85,000', category: 'Bangles', image: '/picture/section-one.jpeg' },
    { id: 3, name: 'Sterling Silver Bracelet', sku: 'SSV-BRC-003', price: '₹ 12,500', category: 'Bracelets', image: '/images/floral_kundan.png' },
    { id: 4, name: 'Classic Diamond Ring', sku: 'SSV-RNG-004', price: '₹ 75,000', category: 'Rings', image: '/images/mango_kundan.png' },
    { id: 5, name: 'Royal Antique Bridal Set', sku: 'SSV-BRL-005', price: '₹ 4,50,000', category: 'Bridal Sets', image: '/images/floral_kundan.png' },
    { id: 6, name: 'Kundan Choker Necklace', sku: 'SSV-CHK-006', price: '₹ 1,20,000', category: 'Chokers', image: '/picture/section-three.jpeg' },
    { id: 7, name: 'Elegant Everyday Chain', sku: 'SSV-LWT-007', price: '₹ 25,000', category: 'Light Weight Items', image: '/images/mango_kundan.png' },
    { id: 8, name: 'Temple Jewelry Mango Haram', sku: 'SSV-HRM-008', price: '₹ 2,15,000', category: 'Necklaces', image: '/images/floral_kundan.png' },
    { id: 9, name: 'Diamond Encrusted Bangles', sku: 'SSV-BNG-009', price: '₹ 1,45,000', category: 'Bangles', image: '/picture/section-one.jpeg' },
    { id: 10, name: 'Floral Motif Ring', sku: 'SSV-RNG-010', price: '₹ 45,000', category: 'Rings', image: '/images/mango_kundan.png' },
    { id: 11, name: 'Polki Diamond Choker', sku: 'SSV-CHK-011', price: '₹ 3,40,000', category: 'Chokers', image: '/picture/section-three.jpeg' },
    { id: 12, name: 'Minimalist Gold Bracelet', sku: 'SSV-BRC-012', price: '₹ 18,000', category: 'Bracelets', image: '/images/floral_kundan.png' },
    { id: 13, name: 'South Indian Bridal Collection', sku: 'SSV-BRL-013', price: '₹ 5,80,000', category: 'Bridal Sets', image: '/images/floral_kundan.png' },
    { id: 14, name: 'Lightweight Jhumka Earrings', sku: 'SSV-LWT-014', price: '₹ 15,500', category: 'Light Weight Items', image: '/images/mango_kundan.png' },
    { id: 15, name: 'Long Guttapusalu Haram', sku: 'SSV-HRM-015', price: '₹ 1,75,000', category: 'Necklaces', image: '/images/floral_kundan.png' },
    { id: 16, name: 'Traditional Kadas', sku: 'SSV-BNG-016', price: '₹ 95,000', category: 'Bangles', image: '/picture/section-one.jpeg' },
];

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts = selectedCategory === "All" 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className={styles.productsPage}>
            {/* Category Filter Pills */}
            <div className={styles.categoryFilter}>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat} 
                        className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.categoryBtnActive : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                        <Link to={`/products/${product.id}`} className={styles.imageLink} style={{ display: 'block' }}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.productImage}
                                />
                                <button className={styles.wishlistButton} aria-label="Add to Wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                            </div>
                        </Link>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <p className={styles.productSku}>{product.sku}</p>
                            <p className={styles.productPrice}>{product.price}</p>
                            <div className={styles.categoryTagArea}>
                                <span className={styles.categoryTag}>{product.category}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
