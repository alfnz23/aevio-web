'use client'
import { motion } from 'framer-motion'

interface NavigationProps {
  visible: boolean
}

export default function Navigation({ visible }: NavigationProps) {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#8A8070',
        }}
      >
        AEVIO AI
      </span>
      <span
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#8A8070',
        }}
      >
        INTELLIGENCE SYSTEMS
      </span>
    </motion.nav>
  )
}
