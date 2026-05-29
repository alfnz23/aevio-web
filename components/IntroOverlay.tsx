'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.05 } },
}

const lineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const TOP_LINE = 'AEVIO AI · INTELLIGENCE SYSTEMS · EST. 2026'
const HEADLINES = ['Vaše firma.', 'Řízená inteligencí.', 'Nepřetržitě.']

export default function IntroOverlay({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) setVisible(true)
  }, [show])

  useEffect(() => {
    if (!visible) return
    const dismiss = () => setVisible(false)
    // wheel/touch for pointer devices; keydown for keyboard nav
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown'].includes(e.key)) dismiss()
    }
    window.addEventListener('wheel', dismiss, { passive: true })
    window.addEventListener('touchmove', dismiss, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', dismiss)
      window.removeEventListener('touchmove', dismiss)
      window.removeEventListener('keydown', onKey)
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 15,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Top line — letter by letter, 0.2s delay */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.035, delayChildren: 0.2 } },
            }}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '11px', letterSpacing: '0.15em',
              textTransform: 'uppercase', color: '#6A8070',
              marginBottom: '52px', display: 'flex', whiteSpace: 'nowrap',
            }}
          >
            {TOP_LINE.split('').map((ch, i) => (
              <motion.span key={i} variants={charVariants}>
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </motion.div>

          {/* Headline — line by line, 0.8s delay, 0.35s stagger */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.35, delayChildren: 0.8 } },
            }}
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontStyle: 'italic', color: '#E8E0D0',
              fontSize: 'clamp(44px, 5vw, 72px)',
              lineHeight: 1.25, textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            {HEADLINES.map((line, i) => (
              <motion.div key={i} variants={lineVariants}>{line}</motion.div>
            ))}
          </motion.div>

          {/* Status line — 1.8s delay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '11px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#6A8070',
              marginBottom: '40px',
            }}
          >
            NEURAL_NET · ACTIVE&nbsp;&nbsp;·&nbsp;&nbsp;AGENTS · 7&nbsp;&nbsp;·&nbsp;&nbsp;STATUS · OPERATIONAL
          </motion.div>

          {/* Scroll hint — 2.3s delay, then infinite bounce */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.4 }}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '11px', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#6A8070',
            }}
          >
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ delay: 2.7, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
            >
              ↓&nbsp;&nbsp;SCROLL TO EXPLORE
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
