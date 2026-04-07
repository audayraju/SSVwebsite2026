import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Launch.module.css';
import { products } from '../data/productData';

const Launch = () => {
  const [joinEmail, setJoinEmail] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // You can add email submission logic here
      console.log('Launch interest from:', joinEmail);
      setJoinMessage('Thank you for your interest! We will contact you soon.');
      setJoinEmail('');
      
      setTimeout(() => setJoinMessage(''), 3000);
    } catch (error) {
      setJoinMessage('Error submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get featured products
  const featuredProducts = products.slice(0, 6);

  return (
    <div className={styles.launchPage}>
      {/* HERO SECTION */}
      <motion.section 
        className={styles.heroSection}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.heroContent}>
          {/* Logo */}
          <motion.div className={styles.logoWrapper} variants={fadeUp}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>✦</span>
              <span className={styles.logoText}>SSV</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 className={styles.mainTitle} variants={fadeUp}>
            SSV JEWELLERS
          </motion.h1>

          {/* Subtitle */}
          <motion.p className={styles.subtitle} variants={fadeUp}>
            WHOLESALE & MANUFACTURING
          </motion.p>

          {/* Launch Date Badge */}
          <motion.div className={styles.launchBadge} variants={fadeUp}>
            <span className={styles.launchLabel}>LAUNCHED</span>
            <span className={styles.launchDate}>07/04/26</span>
          </motion.div>

          {/* Special Details */}
          <motion.div className={styles.specialDetails} variants={fadeUp}>
            <h2>Special Launch Details</h2>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>Premium Quality Gold, Silver & Diamond Jewellery</p>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>Wholesale Rates with Best Market Prices</p>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>No Making Charges - Only 8% VA on Gold</p>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>Direct from Manufacturer to Retailers</p>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>Certification & Quality Guarantee</p>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>★</span>
                <p>Exclusive Designs & Latest Collections</p>
              </div>
            </div>
          </motion.div>

          {/* Join Section */}
          <motion.div className={styles.joinSection} variants={fadeUp}>
            <h3>Join Our Launch Program</h3>
            <form onSubmit={handleJoinSubmit} className={styles.joinForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={joinEmail}
                onChange={(e) => setJoinEmail(e.target.value)}
                required
                className={styles.emailInput}
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={styles.joinButton}
              >
                {isSubmitting ? 'Joining...' : 'Join Now'}
              </button>
            </form>
            {joinMessage && (
              <p className={styles.joinMessage}>{joinMessage}</p>
            )}
            <p className={styles.joinSubtext}>
              Be among the first to experience our exclusive collection and special pricing!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className={styles.ctaButtons} variants={fadeUp}>
            <Link to="/products" className={styles.primaryButton}>
              View Collections
            </Link>
            <Link to="/contact" className={styles.secondaryButton}>
              Contact Us
            </Link>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className={styles.heroGradient}></div>
      </motion.section>

      {/* FEATURED PRODUCTS SECTION */}
      <motion.section 
        className={styles.featuredSection}
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
          Featured Collection
        </motion.h2>
        <motion.p className={styles.sectionSubtitle} variants={fadeUp}>
          Explore our premium designs from the launch collection
        </motion.p>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product, index) => (
            <motion.div 
              key={product.id} 
              className={styles.productCard}
              variants={fadeUp}
            >
              <div className={styles.productImageWrapper}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.productOverlay}>
                  <Link to={`/products/${product.id}`} className={styles.viewButton}>
                    View Details
                  </Link>
                </div>
              </div>
              <div className={styles.productInfo}>
                <p className={styles.productCategory}>{product.category}</p>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productWeight}>{product.GMS}</p>
                <p className={styles.productSku}>{product.sku}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className={styles.viewAllButton} variants={fadeUp}>
          <Link to="/products" className={styles.seeAllLink}>
            See All Products →
          </Link>
        </motion.div>
      </motion.section>

      {/* BENEFITS SECTION */}
      <motion.section 
        className={styles.benefitsSection}
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        <motion.h2 className={styles.benefitsTitle} variants={fadeUp}>
          Why Choose SSV Jewellers?
        </motion.h2>

        <div className={styles.benefitsGrid}>
          {[
            { title: 'Competitive Pricing', desc: 'Best wholesale rates in the market' },
            { title: 'Quality Assurance', desc: 'Certified and hallmarked jewellery' },
            { title: 'Custom Design', desc: 'Bespoke designs as per requirements' },
            { title: 'Fast Delivery', desc: 'Quick turnaround on bulk orders' },
            { title: 'Expert Craftsmanship', desc: 'Master artisans with 20+ years experience' },
            { title: 'Direct Manufacturing', desc: 'No middlemen - direct from factory' },
          ].map((benefit, index) => (
            <motion.div 
              key={index}
              className={styles.benefitCard}
              variants={fadeUp}
            >
              <div className={styles.benefitNumber}>{index + 1}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CLOSING CTA */}
      <motion.section 
        className={styles.closingSection}
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
      >
        <motion.div className={styles.closingContent} variants={fadeUp}>
          <h2>Be Part of Our Success Story</h2>
          <p>Experience the excellence of SSV Jewellers - Where Quality Meets Affordability</p>
          <div className={styles.closingButtons}>
            <Link to="/contact" className={styles.contactButton}>
              Get in Touch
            </Link>
            <a href="https://wa.me/918555903801" className={styles.whatsappButton} target="_blank" rel="noopener noreferrer">
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Launch;
