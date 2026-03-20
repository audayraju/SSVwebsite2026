// Reusable Framer Motion presets for scroll animations across pages

// Fade-up animation (requested: opacity 0->1, y 50->0)
export const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// Parent stagger animation for child elements
export const staggerParent = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
}

// once:false => animation can reverse when scrolling away and trigger again
export const inViewViewport = {
  once: false,
  amount: 0.18,
}
