'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// SVG neural network paths — organic Catmull-Rom inspired bezier curves
const MAIN_PATHS = [
  { d: 'M 0 210 C 240 170 480 310 720 270 S 1080 170 1440 230', w: 1.2, op: 0.6, dur: 2.0, delay: 0.1 },
  { d: 'M 0 560 C 280 525 580 605 900 545 S 1200 480 1440 555', w: 1.0, op: 0.55, dur: 2.0, delay: 0.3 },
  { d: 'M 0 800 C 260 760 540 800 720 740 S 1100 690 1440 750', w: 0.9, op: 0.4,  dur: 1.8, delay: 0.6 },
  { d: 'M 230 0 C 250 190 290 390 300 550 S 315 760 275 900', w: 1.0, op: 0.5,  dur: 1.8, delay: 0.15 },
  { d: 'M 560 0 C 580 150 600 310 615 460 S 595 680 555 900', w: 0.8, op: 0.4,  dur: 1.6, delay: 0.45 },
  { d: 'M 920 0 C 940 150 960 350 940 500 S 895 710 875 900', w: 0.9, op: 0.5,  dur: 1.8, delay: 0.65 },
  { d: 'M 1285 0 C 1245 180 1205 390 1225 550 S 1280 760 1200 900', w: 0.8, op: 0.4, dur: 1.6, delay: 0.9 },
  { d: 'M 0 390 C 360 350 720 430 1080 390 S 1325 365 1440 405', w: 1.1, op: 0.58, dur: 2.2, delay: 1.1 },
]

const BRANCHES = [
  { d: 'M 300 550 C 360 485 425 465 485 495', w: 0.6, op: 0.32, delay: 0.8 },
  { d: 'M 618 456 C 668 418 710 405 762 424', w: 0.6, op: 0.3,  delay: 1.0 },
  { d: 'M 940 498 C 982 456 1024 424 1062 408', w: 0.6, op: 0.3, delay: 1.2 },
  { d: 'M 720 545 C 760 582 800 608 832 655', w: 0.5, op: 0.25, delay: 1.3 },
  { d: 'M 720 545 C 682 575 660 618 638 668', w: 0.5, op: 0.25, delay: 1.35 },
  { d: 'M 558 268 C 580 235 603 208 634 195', w: 0.5, op: 0.3,  delay: 0.6 },
  { d: 'M 1082 248 C 1112 212 1145 192 1182 186', w: 0.5, op: 0.3, delay: 0.85 },
  { d: 'M 278 760 C 315 845 375 825 422 808', w: 0.5, op: 0.25, delay: 1.4 },
  { d: 'M 298 392 C 342 355 382 342 424 352', w: 0.5, op: 0.25, delay: 1.12 },
  { d: 'M 1202 398 C 1262 378 1315 370 1362 376', w: 0.5, op: 0.25, delay: 1.32 },
  { d: 'M 900 545 C 882 610 878 665 892 720', w: 0.5, op: 0.28, delay: 1.42 },
  { d: 'M 230 210 C 210 165 215 125 240 92',  w: 0.5, op: 0.25, delay: 0.55 },
]

const NODES = [
  { cx: 230, cy: 210, r: 4.5, warm: false, delay: 0.55 },
  { cx: 558, cy: 268, r: 4,   warm: true,  delay: 0.7 },
  { cx: 720, cy: 270, r: 7,   warm: true,  delay: 0.9 },  // focal
  { cx: 1082,cy: 248, r: 4.5, warm: false, delay: 0.88 },
  { cx: 1285,cy: 205, r: 3.5, warm: false, delay: 1.02 },
  { cx: 300, cy: 550, r: 4.5, warm: true,  delay: 0.95 },
  { cx: 618, cy: 456, r: 5.5, warm: false, delay: 1.05 },
  { cx: 900, cy: 545, r: 8,   warm: true,  delay: 1.12 }, // large focal
  { cx: 1202,cy: 398, r: 4.5, warm: false, delay: 1.18 },
  { cx: 558, cy: 705, r: 3.5, warm: true,  delay: 1.22 },
  { cx: 720, cy: 545, r: 5,   warm: true,  delay: 1.28 },
  { cx: 940, cy: 498, r: 4.5, warm: false, delay: 1.32 },
  { cx: 878, cy: 740, r: 3.5, warm: false, delay: 1.38 },
  { cx: 278, cy: 762, r: 3,   warm: true,  delay: 1.42 },
  { cx: 1220,cy: 548, r: 4,   warm: true,  delay: 1.48 },
]

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: '#030810', overflow: 'hidden' }}>

      {/* Full-bleed SVG neural network */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <radialGradient id="glowWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD4A0" stopOpacity="1" />
            <stop offset="55%"  stopColor="#C8A96E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C8A96E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowCool" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C8E0FF" stopOpacity="1" />
            <stop offset="55%"  stopColor="#7AAED4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7AAED4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {MAIN_PATHS.map((p, i) => (
          <motion.path
            key={`main-${i}`}
            d={p.d}
            stroke="#C8A96E"
            strokeWidth={p.w}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: p.op } : {}}
            transition={{ duration: p.dur, delay: p.delay, ease: [0.25, 0.1, 0.25, 1] }}
          />
        ))}

        {BRANCHES.map((b, i) => (
          <motion.path
            key={`branch-${i}`}
            d={b.d}
            stroke="#C8A96E"
            strokeWidth={b.w}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: b.op } : {}}
            transition={{ duration: 0.8, delay: b.delay, ease: 'easeOut' }}
          />
        ))}

        {NODES.map((n, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={n.cx} cy={n.cy} r={n.r * 5}
              fill={n.warm ? 'url(#glowWarm)' : 'url(#glowCool)'}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.45, scale: 1 } : {}}
              style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
              transition={{ duration: 0.6, delay: n.delay + 0.15 }}
            />
            <motion.circle
              cx={n.cx} cy={n.cy} r={n.r}
              fill={n.warm ? '#FFD4A0' : '#C8E0FF'}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
              transition={{ duration: 0.4, delay: n.delay + 0.25, type: 'spring', stiffness: 220 }}
            />
          </g>
        ))}
      </svg>

      {/* Dark gradient overlay at bottom so text is readable */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(to top, #030810 40%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top-right label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ position: 'absolute', top: 28, right: 32, fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6A8070', zIndex: 2 }}
      >
        EST. 2026&nbsp;&nbsp;//&nbsp;&nbsp;CZECH REPUBLIC
      </motion.div>

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, delay: 1.3, ease: 'easeOut' }}
        style={{
          position: 'absolute', bottom: '20%', left: '8%',
          fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
          fontSize: 'clamp(44px, 5vw, 72px)', color: '#E8E0D0',
          lineHeight: 1.2, zIndex: 2,
        }}
      >
        <div>Vaše firma.</div>
        <div>Řízená inteligencí.</div>
        <div>Nepřetržitě.</div>
      </motion.div>

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.9 }}
        style={{
          position: 'absolute', bottom: '11%', left: '8%',
          fontFamily: 'var(--font-space-mono)', fontSize: '10px',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', zIndex: 2,
        }}
      >
        NEURAL_NET · ACTIVE&nbsp;&nbsp;·&nbsp;&nbsp;AGENTS · 7&nbsp;&nbsp;·&nbsp;&nbsp;STATUS · OPERATIONAL
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2.2 }}
        style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070' }}
        >
          ↓&nbsp;&nbsp;SCROLL TO EXPLORE
        </motion.span>
      </motion.div>
    </div>
  )
}
