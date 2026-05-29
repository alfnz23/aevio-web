'use client'
import { motion } from 'framer-motion'

export default function CTAButton() {
  return (
    <motion.a
      href="mailto:aevioai@gmail.com"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ backgroundColor: '#0F0C08', color: '#F2EDE6' }}
      style={{
        display: 'inline-block',
        padding: '14px 28px',
        border: '1px solid #8A8070',
        color: '#0F0C08',
        backgroundColor: 'transparent',
        fontFamily: 'var(--font-space-mono), monospace',
        fontSize: '11px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'none',
        transition: 'background-color 0.2s ease, color 0.2s ease',
      }}
    >
      DOMLUVIT BEZPLATNÝ AUDIT
    </motion.a>
  )
}
