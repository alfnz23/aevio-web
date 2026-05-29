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
        setTimeout(onComplete, 700)
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
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: '#030810',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '40px',
          }}
        >
          {/* Neural network SVG drawing itself */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
            <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
              {/* Central glow */}
              <circle cx="250" cy="250" r="6" fill="#FFD4A0" className="node-pulse" />
              {/* Main branches radiating outward */}
              <line className="tube-draw" x1="250" y1="250" x2="420" y2="200" stroke="#1A5080" strokeWidth="1.2" style={{ animationDelay: '0s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="380" y2="100" stroke="#1A5080" strokeWidth="1.0" style={{ animationDelay: '0.12s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="240" y2="60" stroke="#1A5080" strokeWidth="0.9" style={{ animationDelay: '0.24s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="110" y2="110" stroke="#1A5080" strokeWidth="1.0" style={{ animationDelay: '0.36s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="60" y2="240" stroke="#1A5080" strokeWidth="1.1" style={{ animationDelay: '0.48s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="100" y2="390" stroke="#1A5080" strokeWidth="1.0" style={{ animationDelay: '0.60s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="270" y2="440" stroke="#1A5080" strokeWidth="0.9" style={{ animationDelay: '0.72s' }} />
              <line className="tube-draw" x1="250" y1="250" x2="420" y2="360" stroke="#1A5080" strokeWidth="1.0" style={{ animationDelay: '0.84s' }} />
              {/* Sub-dendrites from tips */}
              <line className="tube-draw" x1="420" y1="200" x2="470" y2="170" stroke="#0D2B45" strokeWidth="0.6" style={{ animationDelay: '0.5s' }} />
              <line className="tube-draw" x1="420" y1="200" x2="445" y2="240" stroke="#0D2B45" strokeWidth="0.5" style={{ animationDelay: '0.55s' }} />
              <line className="tube-draw" x1="380" y1="100" x2="420" y2="70" stroke="#0D2B45" strokeWidth="0.6" style={{ animationDelay: '0.62s' }} />
              <line className="tube-draw" x1="110" y1="110" x2="70" y2="80" stroke="#0D2B45" strokeWidth="0.5" style={{ animationDelay: '0.74s' }} />
              <line className="tube-draw" x1="110" y1="110" x2="90" y2="155" stroke="#0D2B45" strokeWidth="0.5" style={{ animationDelay: '0.80s' }} />
              <line className="tube-draw" x1="60" y1="240" x2="30" y2="210" stroke="#0D2B45" strokeWidth="0.6" style={{ animationDelay: '0.86s' }} />
              <line className="tube-draw" x1="60" y1="240" x2="35" y2="270" stroke="#0D2B45" strokeWidth="0.5" style={{ animationDelay: '0.92s' }} />
              <line className="tube-draw" x1="100" y1="390" x2="60" y2="420" stroke="#0D2B45" strokeWidth="0.5" style={{ animationDelay: '1.0s' }} />
              <line className="tube-draw" x1="420" y1="360" x2="460" y2="390" stroke="#0D2B45" strokeWidth="0.6" style={{ animationDelay: '1.1s' }} />
              {/* Synapse dots at branch tips */}
              <circle cx="420" cy="200" r="3" fill="#C8E0FF" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 0.5s' }} />
              <circle cx="380" cy="100" r="2.5" fill="#C8E0FF" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 0.62s' }} />
              <circle cx="240" cy="60" r="2" fill="#FFD4A0" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 0.74s' }} />
              <circle cx="110" cy="110" r="2.5" fill="#C8E0FF" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 0.86s' }} />
              <circle cx="60" cy="240" r="3" fill="#FFD4A0" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 0.98s' }} />
              <circle cx="100" cy="390" r="2.5" fill="#C8E0FF" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 1.1s' }} />
              <circle cx="270" cy="440" r="2" fill="#FFD4A0" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 1.22s' }} />
              <circle cx="420" cy="360" r="3" fill="#C8E0FF" style={{ opacity: 0, animation: 'nodePulse 1.5s ease-in-out infinite 1.34s' }} />
            </svg>
          </div>

          {/* AEVIO letters */}
          <div style={{ display: 'flex', gap: '8px', position: 'relative', zIndex: 1 }}>
            {letters.map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '32px',
                  letterSpacing: '0.5em',
                  color: '#FFD4A0',
                }}
              >
                {l}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#4A5A50',
              textTransform: 'uppercase',
              position: 'relative', zIndex: 1,
            }}
          >
            INITIALIZING NEURAL NETWORK...
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              width: '160px', height: '1px',
              backgroundColor: '#0D2B45',
              overflow: 'hidden',
              position: 'relative', zIndex: 1,
            }}
          >
            <div style={{
              height: '100%',
              backgroundColor: '#FFD4A0',
              width: `${progress * 100}%`,
              transition: 'width 0.3s ease',
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
