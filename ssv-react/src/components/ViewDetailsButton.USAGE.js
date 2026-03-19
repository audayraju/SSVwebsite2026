/**
 * ViewDetailsButton - USAGE GUIDE
 * 
 * A reusable, premium button component for luxury e-commerce sites.
 * Fully accessible, responsive, and customizable with CSS variables.
 */

// ============================================================================
// BASIC USAGE
// ============================================================================

import ViewDetailsButton from './components/ViewDetailsButton';

// Simple example - navigates to product details page
<ViewDetailsButton to="/products/product-id-123" />

// ============================================================================
// WITH CUSTOM STYLING
// ============================================================================

// Using CSS variables for branding
<ViewDetailsButton 
  to="/products/sapphire-ring"
  bgColor="var(--primary-gold)"
  textColor="var(--text-dark)"
  borderColor="var(--primary-gold)"
/>

// Using hex colors directly
<ViewDetailsButton 
  to="/products/necklace"
  bgColor="#D4AF37"
  textColor="#1a1a1a"
  borderColor="#D4AF37"
/>

// Transparent/outline variant
<ViewDetailsButton 
  to="/products/bracelet"
  bgColor="transparent"
  textColor="#D4AF37"
  borderColor="#D4AF37"
/>

// ============================================================================
// WITH CUSTOM TEXT
// ============================================================================

<ViewDetailsButton 
  to="/products/ring"
  bgColor="var(--primary-color)"
>
  Explore More
</ViewDetailsButton>

// ============================================================================
// WITH CLICK HANDLER
// ============================================================================

const handleViewDetails = (e) => {
    console.log('User clicked View Details');
    // Additional logic before navigation
};

<ViewDetailsButton 
  to="/products/earrings"
  onClick={handleViewDetails}
  bgColor="var(--primary-gold)"
/>

// ============================================================================
// DISABLED STATE
// ============================================================================

// Button disabled when product is unavailable
<ViewDetailsButton 
  to="/products/out-of-stock"
  disabled={isOutOfStock}
  bgColor="var(--primary-color)"
  ariaLabel="View details - Product out of stock"
/>

// ============================================================================
// LOADING STATE
// ============================================================================

const [isLoading, setIsLoading] = useState(false);

const handleLoadProductDetails = async (productId) => {
    setIsLoading(true);
    try {
        // Fetch product data
        await fetchProductDetails(productId);
        // Navigation happens automatically
    } finally {
        setIsLoading(false);
    }
};

<ViewDetailsButton
    to="/products/diamond-ring"
    isLoading={isLoading}
    onClick={handleLoadProductDetails}
    bgColor="var(--primary-gold)"
/>

// ============================================================================
// IN A PRODUCT CARD COMPONENT
// ============================================================================

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <ViewDetailsButton
                to={`/products/${product.id}`}
                bgColor="var(--primary-gold)"
                textColor="var(--text-dark)"
                ariaLabel={`View details for ${product.name}`}
            />
        </div>
    );
};

// ============================================================================
// WITH ACCESSIBILITY FEATURES
// ============================================================================

// Custom aria-label for screen readers
<ViewDetailsButton 
  to="/products/necklace"
  ariaLabel="View details for 18k gold diamond necklace"
  bgColor="var(--primary-gold)"
/>

// Mobile-friendly touch target
// Component automatically ensures 48px minimum height
<ViewDetailsButton 
  to="/products/bracelet"
  bgColor="var(--primary-color)"
/>

// Keyboard accessible (Tab, Enter/Space to activate)
// Test: Tab to button → Press Enter or Space → Navigates

// ============================================================================
// WITH CUSTOM CLASSES
// ============================================================================

<ViewDetailsButton 
  to="/products/ring"
  bgColor="var(--primary-gold)"
  className="featured-button"  // Add custom styles
/>

// ============================================================================
// STYLING IN YOUR CSS
// ============================================================================

/* In your component CSS module or global styles */

/* Override for premium gold theme */
:root {
    --primary - gold: #D4AF37;
    --text - dark: #1a1a1a;
    --button - bg: var(--primary - gold);
    --button - text: var(--text - dark);
    --button - border: var(--primary - gold);
}

/* Optional: Add custom button variant */
.featured - button {
    font - weight: 600;
    letter - spacing: 1px;
    text - transform: uppercase;
    font - size: 0.9rem!important;
}

// ============================================================================
// PROP REFERENCE
// ============================================================================

/*
 * PROPS
 * 
 * to (string) - Optional
 *   Destination path for navigation (e.g., "/products/123")
 *   If provided, button uses React Router navigation
 * 
 * onClick (function) - Optional
 *   Callback function when button clicked
 *   Signature: (e) => void
 * 
 * disabled (boolean) - Default: false
 *   Disables button (reduced opacity, no pointer events)
 * 
 * isLoading (boolean) - Default: false
 *   Shows loading spinner, disables click
 *   Text changes to "Loading..."
 * 
 * bgColor (string) - Default: 'var(--button-bg, #D4AF37)'
 *   Background color (CSS variable name or hex)
 * 
 * textColor (string) - Default: 'var(--button-text, #1a1a1a)'
 *   Text color (CSS variable name or hex)
 * 
 * borderColor (string) - Default: 'var(--button-border, #D4AF37)'
 *   Border color (CSS variable name or hex)
 * 
 * children (string/React.ReactNode) - Default: 'View Details'
 *   Button label text
 * 
 * ariaLabel (string) - Default: 'View product details'
 *   Accessibility label for screen readers
 * 
 * className (string) - Default: ''
 *   Additional CSS classes to apply
 * 
 * ...otherProps
 *   Any other HTML button attributes (id, data-*, etc.)
 */

// ============================================================================
// FEATURES
// ============================================================================

/*
 * ✓ Minimum 48px height (mobile-friendly touch target)
 * ✓ Responsive padding with clamp() for mobile-to-desktop
 * ✓ Premium hover effect (slight lift + enhanced shadow)
 * ✓ Active/pressed visual feedback
 * ✓ Focus outline outline for keyboard navigation
 * ✓ Disabled state with reduced opacity
 * ✓ Loading state with animated spinner
 * ✓ Dynamic color support (props + CSS variables)
 * ✓ Fully accessible (WCAG 2.1 AA)
 * ✓ Keyboard accessible (Tab + Enter/Space)
 * ✓ Respects prefers-reduced-motion
 * ✓ Dark mode support
 * ✓ High contrast mode support
 * ✓ Clean, luxury branding aesthetic
 */

// ============================================================================
// ADVANCED: PRODUCT GRID WITH MULTIPLE BUTTONS
// ============================================================================

const ProductGrid = ({ products }) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = async (productId) => {
        setLoadingId(productId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Navigation will happen via 'to' prop
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="product-grid">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                    <ViewDetailsButton
                        to={`/products/${product.id}`}
                        onClick={() => handleViewDetails(product.id)}
                        isLoading={loadingId === product.id}
                        disabled={product.outOfStock}
                        bgColor="var(--primary-gold)"
                        textColor="var(--text-dark)"
                        ariaLabel={`View details for ${product.name}`}
                    />
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// INTEGRATION WITH EXISTING COMPONENTS
// ============================================================================

// In ProductDetails.jsx - using with ProductCard
import ViewDetailsButton from './ViewDetailsButton';
import ProductCard from './ProductCard';

export default function Products() {
    const products = [
        { id: 1, name: 'Diamond Ring', price: 5000, image: '...' },
        { id: 2, name: 'Gold Necklace', price: 3000, image: '...' },
        { id: 3, name: 'Pearl Earrings', price: 1500, image: '...' },
    ];

    return (
        <div className="products-page">
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <ProductCard product={product} />
                        <ViewDetailsButton
                            to={`/products/${product.id}`}
                            bgColor="var(--luxury-gold)"
                            textColor="var(--dark-text)"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
