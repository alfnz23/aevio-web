'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingScreenProps {
  progress: number
  onComplete: () => void
}

export default function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (progress >= 1) {
      const t = setTimeout(() => {
        setVisible(false)
        setTimeout(onComplete, 600)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [progress, onComplete])

  const letters = 'AEVIO'.split('')

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#0F0C08',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {/* Letters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '28px',
                  letterSpacing: '0.4em',
                  color: '#F2EDE6',
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          {/* Progress line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              width: '120px',
              height: '1px',
              backgroundColor: '#1A1208',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                backgroundColor: '#C8A96E',
                width: `${progress * 100}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
