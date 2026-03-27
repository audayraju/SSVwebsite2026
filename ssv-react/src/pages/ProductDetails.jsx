import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './ProductDetails.module.css';

const defaultProduct = {
    id: 1,
    name: 'MANGO INSPIRED KUNDAN JHUMKA EARRINGS',
    sku: 'JGT1418',
    image: '/images/mango_kundan.png',
    description: 'Beautiful mango-shaped earrings intricately detailed in fine Kundan artistry.'
};

const productDatabase = {
    'collection-necklace': {
        name: 'Necklace Collection',
        sku: 'SSV-COL-NCK',
        image: '/picture/section-one.jpeg',
        description: 'Explore our latest exquisite necklace designs. Each piece reflects the pinnacle of artisan craftsmanship and timeless gold elegance.'
    },
    'collection-haram': {
        name: 'Haram Collection',
        sku: 'SSV-COL-HRM',
        image: '/picture/section-twoo.jpeg',
        description: 'Traditional grandeur for elegant occasions. Featuring heavy gold work and intricate motifs that embody a rich cultural heritage.'
    },
    'collection-chokers': {
        name: 'Chokers Collection',
        sku: 'SSV-COL-CHK',
        image: '/picture/section-three.jpeg',
        description: 'Elevate your neckline with our exquisitely detailed chokers, stunningly studded with radiant gems and rich Kundan detailing.'
    },
    'collection-bangles': {
        name: 'Bangles Collection',
        sku: 'SSV-COL-BNG',
        image: '/picture/section-one.jpeg',
        description: 'Beautifully sculpted gold bangles to adorn your wrists. A perfect blend of heritage, durability, and contemporary charm.'
    },
    'collection-cz': {
        name: 'CZ Collection',
        sku: 'SSV-COL-CZ',
        image: '/picture/section-twoo.jpeg',
        description: 'Brilliant Cubic Zirconia pieces that offer the dazzle of diamonds. Experience exceptional clarity and mesmerizing designs.'
    },
    '1': {
        name: 'Radha Krishna Haram',
        sku: 'SSV-HRM-001',
        image: '/images/floral_kundan.png',
        description: 'A masterpiece beautifully portraying Radha Krishna, set in heavy gold and premium colored stones.'
    },
    '2': {
        name: 'Classic Diamond Ring',
        sku: 'SSV-RNG-002',
        image: '/images/mango_kundan.png',
        description: 'A classic ring crafted with stunning brilliance and premium cut diamonds.'
    }
};

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = productDatabase[id] || defaultProduct;
    
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

    return (
        <div className={styles.detailsPage}>
            <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Back to Collection
            </button>
            
            <div className={styles.container}>
                <div className={styles.imageSection}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className={styles.mainImage} 
                        onClick={toggleZoom}
                        title="Click to zoom"
                    />
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.productTitle}>{product.name}</h1>
                    <p className={styles.productSku}>SKU: {product.sku}</p>
                    
                    <div className={styles.divider}></div>
                    
                    <p className={styles.productDescription}>{product.description}</p>
                    
                    <div className={styles.divider}></div>

                    <button className={styles.priceRequestBtn}>
                        <svg className={styles.whatsappIcon} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                        Price On Request
                    </button>

                    <div className={styles.accordionsInline}>
                        <div className={styles.dropdownBox}>Description <span>▼</span></div>
                        <div className={styles.dropdownBox}>Specification <span>▼</span></div>
                        <div className={styles.dropdownBox}>Price Breakup <span>▼</span></div>
                    </div>

                    <div className={styles.accordionFull}>
                        Product Details <span>▼</span>
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
