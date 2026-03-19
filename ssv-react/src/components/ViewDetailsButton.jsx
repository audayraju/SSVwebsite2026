import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewDetailsButton.module.css';

/**
 * ViewDetailsButton - Reusable premium button component for luxury e-commerce
 * 
 * Usage Example:
 * <ViewDetailsButton 
 *   to="/products/product-id"
 *   bgColor="var(--primary-gold)"
 *   textColor="var(--text-dark)"
 * />
 */
const ViewDetailsButton = ({
    to,
    onClick,
    disabled = false,
    isLoading = false,
    bgColor = 'var(--button-bg, #D4AF37)',
    textColor = 'var(--button-text, #1a1a1a)',
    borderColor = 'var(--button-border, #D4AF37)',
    children = 'View Details',
    ariaLabel = 'View product details',
    className = '',
    ...otherProps
}) => {
    const navigate = useNavigate();
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e) => {
        if (disabled || isLoading) {
            e.preventDefault();
            return;
        }

        if (onClick) {
            onClick(e);
        }

        if (to && !e.defaultPrevented) {
            navigate(to);
        }
    };

    const handleKeyDown = (e) => {
        // Enter and Space should trigger button
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading) {
            e.preventDefault();
            handleClick(e);
        }
    };

    const buttonStyle = {
        '--btn-bg': bgColor,
        '--btn-text': textColor,
        '--btn-border': borderColor,
    };

    const combinedClassName = `${styles.viewDetailsButton} ${className}`.trim();

    return (
        <button
            className={combinedClassName}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            aria-label={ariaLabel}
            aria-busy={isLoading}
            style={buttonStyle}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            {...otherProps}
        >
            <span className={styles.buttonContent}>
                {isLoading && (
                    <span className={styles.spinner} aria-hidden="true">
                        <svg
                            className={styles.spinnerIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                opacity="0.2"
                            />
                            <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>
                )}
                <span className={styles.text}>
                    {isLoading ? 'Loading...' : children}
                </span>
            </span>
        </button>
    );
};

export default ViewDetailsButton;
