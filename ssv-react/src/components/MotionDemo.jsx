import { motion } from 'framer-motion'
import styles from './MotionDemo.module.css'

// Parent container variants for stagger animation
const listVariants = {
    hidden: {},
    visible: {
        transition: {
            // Each child appears one by one
            staggerChildren: 0.18,
        },
    },
}

// Reusable fade-up animation (opacity: 0 -> 1, y: 50 -> 0)
const fadeUpVariant = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

export default function MotionDemo() {
    return (
        <section className={styles.section} aria-label="Framer Motion animation demo">
            {/*
        Simple single element fade-up animation.
        whileInView triggers animation when this block enters viewport.
      */}
            <motion.h2
                className={styles.title}
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                Smooth Scroll Animations
            </motion.h2>

            {/*
        Stagger example:
        - Parent controls when children animate.
        - Children use the same fade-up variant.
      */}
            <motion.div
                className={styles.grid}
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {['Elegant Designs', 'Premium Crafting', 'Trusted Quality'].map((item) => (
                    <motion.article key={item} className={styles.card} variants={fadeUpVariant}>
                        <h3>{item}</h3>
                        <p>
                            This card fades in and moves up when it enters the screen.
                        </p>
                    </motion.article>
                ))}
            </motion.div>
        </section>
    )
}
