import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './ProductDetails.module.css';

import { products } from '../data/productData';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find(p => p.id === id) || products[0];
    
    const [isZoomed, setIsZoomed] = useState(false);
    const [isInnerZoomed, setIsInnerZoomed] = useState(false);
    const [transformOrigin, setTransformOrigin] = useState('50% 50%');

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
        setIsInnerZoomed(false); // Reset tight zoom on close
    };

    // Close zoom when Esc key is pressed, or navigate back if zoom is already closed
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (isZoomed) {
                    toggleZoom();
                } else {
                    navigate(-1);
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isZoomed, navigate]);

    // Use backend API endpoint for images
    const imgSrc = product && product.imageUrl
        ? product.imageUrl
        : '/slides/pictures/logo.jpeg';

    const handleImageClick = (e) => {
        e.stopPropagation(); // prevent modal close on image click
    };

    const handleDoubleTap = (e) => {
        e.stopPropagation();
        setIsInnerZoomed(!isInnerZoomed);
        if (!isInnerZoomed) {
             handleMouseMove(e);
        } else {
             setTransformOrigin('50% 50%');
        }
    };

    const handleMouseMove = (e) => {
        if (!isInnerZoomed) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        setTransformOrigin(`${x}% ${y}%`);
    };

    const handleTouchMove = (e) => {
        if (!isInnerZoomed || e.touches.length === 0) return;
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 100;
        const y = (touch.clientY / window.innerHeight) * 100;
        setTransformOrigin(`${x}% ${y}%`);
    };

    const [activeAccordion, setActiveAccordion] = useState('description');

    const toggleAccordion = (id) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
        <div className={styles.detailsPage}>
            {/* FIGMA Pattern Backgrounds */}
            {/* Decorative backgrounds removed */}

            <div className={styles.contentWrapper}>
                <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    <span>Back to Collection</span>
                </button>
                
                <div className={styles.mainGrid}>
                    {/* LEFT: Image Section */}
                    <div className={styles.imageSection}>
                        <div className={styles.imageFrame}>
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className={styles.mainImage} 
                                onClick={toggleZoom}
                            />
                        </div>
                    </div>

                    {/* RIGHT: Info Section */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoGlass}>
                            <span className={styles.categoryTag}>{product.category}</span>
                            <h1 className={styles.productTitle}>{product.name}</h1>
                            <p className={styles.skuTag}>SKU: <span>{product.sku}</span></p>
                            
                            <div className={styles.priceContainer}>
                                <span className={styles.priceLabel}>Estimated Price</span>
                                <h2 className={styles.productPrice}>{product.price}</h2>
                            </div>

                            <div className={styles.productDescription}>
                                <p>{product.description}</p>
                            </div>

                            <a 
                                href={`https://wa.me/9177396962?text=Hi, I am interested in ${product.name} (SKU: ${product.sku})`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.enquireBtn}
                            >
                                <svg className={styles.whatsappIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                </svg>
                                <span>Enquire on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Zoom Modal */}
            {isZoomed && (
                <div 
                    className={styles.zoomModalOpen} 
                    onClick={toggleZoom}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                >
                    <button className={styles.closeZoomBtn} onClick={toggleZoom}>✕</button>
                    <img 
                        src={product.image} 
                        alt="Zoomed Product" 
                        className={`${styles.zoomedImage} ${isInnerZoomed ? styles.zoomedImageActive : ''}`}
                        style={{ transformOrigin }}
                        onClick={handleImageClick}
                        onDoubleClick={handleDoubleTap}
                    />
                </div>
            )}
        </div>
    );
}
