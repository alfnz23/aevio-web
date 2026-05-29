'use client'
import { motion } from 'framer-motion'

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, delay: 0.5 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070' }}>
        AEVIO AI
      </span>
      <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070' }}>
        INTELLIGENCE SYSTEMS
      </span>
    </motion.nav>
  )
}
