'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Positions as % of viewport (x, y)
// CEO at center, 6 others form a heptagon ring
const AGENTS = [
  { key: 'CEO',      sub: 'STRATEGIC COMMAND',  x: 50, y: 42, r: 20, warm: true,  labelDir: 'below' },
  { key: 'SALES',    sub: 'CLIENT ACQUISITION',  x: 72, y: 22, r: 14, warm: false, labelDir: 'right' },
  { key: 'CLIENT',   sub: 'RELATIONSHIP MGMT',   x: 84, y: 52, r: 14, warm: true,  labelDir: 'right' },
  { key: 'DEV',      sub: 'ENGINEERING',          x: 70, y: 73, r: 14, warm: false, labelDir: 'right' },
  { key: 'RESEARCH', sub: 'INTELLIGENCE',         x: 30, y: 76, r: 14, warm: true,  labelDir: 'left'  },
  { key: 'FINANCE',  sub: 'OPERATIONS',           x: 16, y: 52, r: 14, warm: false, labelDir: 'left'  },
  { key: 'AUDIT',    sub: 'QUALITY CONTROL',      x: 28, y: 24, r: 14, warm: true,  labelDir: 'left'  },
]

// SVG lines in viewBox 0 0 100 100 — hub (CEO) spokes + outer ring
const SPOKES = [
  'M 50 42 C 60 34 67 27 72 22',
  'M 50 42 C 65 46 76 49 84 52',
  'M 50 42 C 60 55 66 65 70 73',
  'M 50 42 C 42 58 37 69 30 76',
  'M 50 42 C 36 48 26 50 16 52',
  'M 50 42 C 40 34 34 28 28 24',
]
const RING = [
  'M 72 22 C 79 34 83 44 84 52',
  'M 84 52 C 79 61 76 68 70 73',
  'M 70 73 C 56 75 44 76 30 76',
  'M 30 76 C 22 68 18 60 16 52',
  'M 16 52 C 20 40 23 31 28 24',
  'M 28 24 C 42 20 58 18 72 22',
]

export default function AgentsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: '#030810', overflow: 'hidden' }}>

      {/* Connection SVG — percentage coords, preserveAspectRatio:none to fill */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        {SPOKES.map((d, i) => (
          <motion.path
            key={`spoke-${i}`} d={d}
            stroke="#C8A96E" strokeWidth="0.18" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.4 } : {}}
            transition={{ duration: 1.0, delay: 0.6 + i * 0.07, ease: 'easeInOut' }}
          />
        ))}
        {RING.map((d, i) => (
          <motion.path
            key={`ring-${i}`} d={d}
            stroke="#C8A96E" strokeWidth="0.12" fill="none" strokeDasharray="0.8 1.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.25 } : {}}
            transition={{ duration: 1.2, delay: 1.2 + i * 0.06, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {/* Agent nodes */}
      {AGENTS.map((agent, i) => {
        const glowColor = agent.warm ? 'rgba(255,212,160,0.28)' : 'rgba(200,224,255,0.22)'
        const coreColor = agent.warm
          ? 'radial-gradient(circle, #FFD4A0 0%, #C8A96E 65%)'
          : 'radial-gradient(circle, #E8F4FF 0%, #C8E0FF 65%)'
        const shadowColor = agent.warm
          ? `0 0 ${agent.r * 1.6}px rgba(200,169,110,0.9), 0 0 ${agent.r * 3.5}px rgba(200,169,110,0.35)`
          : `0 0 ${agent.r * 1.6}px rgba(200,224,255,0.85), 0 0 ${agent.r * 3.5}px rgba(200,224,255,0.3)`

        const labelStyle: React.CSSProperties =
          agent.labelDir === 'below'
            ? { position: 'absolute', top: '130%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', whiteSpace: 'nowrap' }
            : agent.labelDir === 'right'
              ? { position: 'absolute', left: `${agent.r + 14}px`, top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }
              : { position: 'absolute', right: `${agent.r + 14}px`, top: '50%', transform: 'translateY(-50%)', whiteSpace: 'nowrap', textAlign: 'right' }

        return (
          <div
            key={agent.key}
            style={{ position: 'absolute', left: `${agent.x}%`, top: `${agent.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Glow halo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, type: 'spring', stiffness: 120 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                width: agent.r * 4.5, height: agent.r * 4.5,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Node circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: [0, 1.25, 1] } : {}}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.1 }}
              style={{
                width: agent.r, height: agent.r, borderRadius: '50%',
                background: coreColor, boxShadow: shadowColor,
                position: 'relative', zIndex: 1,
              }}
            >
              {/* Pulse ring */}
              <motion.div
                animate={inView ? { scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] } : {}}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                style={{
                  position: 'absolute', inset: '-40%', borderRadius: '50%',
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                }}
              />
            </motion.div>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, x: agent.labelDir === 'right' ? 8 : agent.labelDir === 'left' ? -8 : 0 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.09 }}
              style={labelStyle}
            >
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8E0D0', marginBottom: 3 }}>
                {agent.key}
              </div>
              <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A8070' }}>
                {agent.sub}
              </div>
            </motion.div>
          </div>
        )
      })}

      {/* Bottom headline */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, delay: 1.6, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: '14%', left: 0, right: 0, textAlign: 'center',
          fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
          fontSize: 'clamp(34px, 4vw, 56px)', color: '#E8E0D0', zIndex: 2,
        }}
      >
        <div>Sedm agentů.</div>
        <div>Jeden mozek.</div>
      </motion.div>
    </div>
  )
}
