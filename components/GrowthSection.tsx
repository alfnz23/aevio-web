'use client'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

// Stable positions for the growing node grid — pre-computed so they don't re-randomize
const NODE_POSITIONS = Array.from({ length: 48 }, (_, i) => ({
  x: 8 + ((i * 37 + i * i * 7) % 84),
  y: 15 + ((i * 53 + i * 13) % 70),
  r: 3 + (i % 4),
  warm: i % 3 !== 0,
  delay: i * 0.06,
}))

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const count = useMotionValue(0)
  const display = useTransform(count, (v) => Math.round(v).toLocaleString('cs') + suffix)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(count, target, { duration: 2.5, ease: 'easeOut' })
    return ctrl.stop
  }, [inView, count, target])

  return <motion.span ref={ref}>{display}</motion.span>
}

export default function GrowthSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const [nodeCount, setNodeCount] = useState(7)

  // Node count grows from 7 to 42 over ~3.5s
  useEffect(() => {
    if (!inView) return
    let n = 7
    const iv = setInterval(() => {
      n += Math.floor(Math.random() * 4) + 1
      if (n >= 42) { n = 42; clearInterval(iv) }
      setNodeCount(n)
    }, 90)
    return () => clearInterval(iv)
  }, [inView])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: '#030810', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Growing node field in background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {NODE_POSITIONS.slice(0, nodeCount).map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            style={{
              position: 'absolute',
              left: `${n.x}%`, top: `${n.y}%`,
              width: n.r * 2, height: n.r * 2,
              borderRadius: '50%',
              background: n.warm
                ? 'radial-gradient(circle, #FFD4A0 0%, #C8A96E 60%)'
                : 'radial-gradient(circle, #C8E0FF 0%, #7AAED4 60%)',
              boxShadow: n.warm
                ? `0 0 ${n.r * 3}px rgba(200,169,110,0.5)`
                : `0 0 ${n.r * 3}px rgba(200,224,255,0.4)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Connection lines between nearby nodes — static SVG */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {NODE_POSITIONS.slice(0, Math.min(nodeCount, 42)).map((n, i) => {
            if (i === 0) return null
            const prev = NODE_POSITIONS[i - 1]
            const dist = Math.sqrt((n.x - prev.x) ** 2 + (n.y - prev.y) ** 2)
            if (dist > 22) return null
            return (
              <motion.line
                key={`line-${i}`}
                x1={prev.x} y1={prev.y} x2={n.x} y2={n.y}
                stroke="#C8A96E" strokeWidth="0.15"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.2, pathLength: 1 }}
                transition={{ duration: 0.4, delay: n.delay }}
              />
            )
          })}
        </svg>
      </div>

      {/* Dark overlay so content is readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(3,8,16,0.6) 30%, rgba(3,8,16,0.2) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, delay: 0.2, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
            fontSize: 'clamp(36px, 4.5vw, 62px)', color: '#E8E0D0',
            lineHeight: 1.25, marginBottom: 36,
          }}
        >
          <div>Systém se učí.</div>
          <div>Roste. Přidává agenty.</div>
          <div>Nikdy se nezastaví.</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 52 }}
        >
          DNES 7 AGENTŮ&nbsp;&nbsp;·&nbsp;&nbsp;ZÍTRA DESÍTKY&nbsp;&nbsp;·&nbsp;&nbsp;VŽDY AUTONOMNÍ
        </motion.div>

        {/* Stats counters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{ display: 'flex', gap: 'clamp(32px, 6vw, 80px)', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {[
            { label: 'ZÁKAZNÍKŮ OSLOVENO', target: 2847, suffix: '+' },
            { label: 'ROZHODNUTÍ DNES', target: 1204 },
            { label: 'UPTIME', target: 99.97, suffix: '%' },
          ].map((s, i) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(24px, 3vw, 42px)', color: '#C8A96E', fontWeight: 700 }}>
                <Counter target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A5A50', marginTop: 8 }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
