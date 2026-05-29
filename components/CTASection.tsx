'use client'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

function MagneticButton() {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 200, damping: 20 })
  const y = useSpring(rawY, { stiffness: 200, damping: 20 })

  const handleMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    rawX.set((e.clientX - r.left - r.width / 2) * 0.38)
    rawY.set((e.clientY - r.top - r.height / 2) * 0.38)
  }
  const handleLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.a
      ref={btnRef}
      href="mailto:aevioai@gmail.com"
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ backgroundColor: '#C8A96E', color: '#030810', borderColor: '#C8A96E' }}
      transition={{ duration: 0.25 }}
      initial={false}
    >
      <span style={{
        display: 'inline-block',
        padding: '22px 56px',
        border: '1px solid rgba(200,169,110,0.55)',
        color: '#C8A96E',
        backgroundColor: 'transparent',
        fontFamily: 'var(--font-space-mono)',
        fontSize: 'clamp(11px, 1.1vw, 14px)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'none',
        transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
      }}>
        DOMLUVIT BEZPLATNÝ AUDIT
      </span>
    </motion.a>
  )
}

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: '#030810', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Outer slow pulse ring */}
      <motion.div
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.18, 0.35, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '65vmin', height: '65vmin', borderRadius: '50%',
          border: '1px solid rgba(200,169,110,0.2)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Inner glow */}
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        style={{
          position: 'absolute', width: '40vmin', height: '40vmin', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,110,0.15) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Background neural hint — faint SVG paths */}
      <svg
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.15 }}
      >
        <motion.path d="M 0 200 C 400 150 900 300 1440 200" stroke="#C8A96E" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2.5, delay: 0.5 }} />
        <motion.path d="M 0 700 C 400 750 900 600 1440 700" stroke="#C8A96E" strokeWidth="0.8" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2.5, delay: 0.8 }} />
        <motion.path d="M 350 0 C 380 300 400 600 350 900" stroke="#C8A96E" strokeWidth="0.6" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2, delay: 1.1 }} />
        <motion.path d="M 1090 0 C 1060 300 1050 600 1090 900" stroke="#C8A96E" strokeWidth="0.6" fill="none"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 2, delay: 1.4 }} />
      </svg>

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
            fontSize: 'clamp(64px, 8vw, 110px)', color: '#E8E0D0',
            lineHeight: 1.05, marginBottom: 52,
          }}
        >
          Připraveni?
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          style={{ marginBottom: 48, pointerEvents: 'auto' }}
        >
          <MagneticButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 1.5 }}
          style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A5A50', lineHeight: 2, textAlign: 'center' }}
        >
          <div>aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Aevio AI&nbsp;&nbsp;·&nbsp;&nbsp;Czech Republic&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
        </motion.div>
      </div>

      {/* Bottom-right GDPR link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 2.0 }}
        style={{ position: 'absolute', bottom: 28, right: 32, zIndex: 2, pointerEvents: 'auto' }}
      >
        <a href="#" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A5A50', textDecoration: 'none', cursor: 'none' }}>
          ↗&nbsp;&nbsp;GDPR Checklist pro e-shopy&nbsp;&nbsp;·&nbsp;&nbsp;990 Kč
        </a>
      </motion.div>
    </div>
  )
}
