'use client'
import { motion, AnimatePresence } from 'framer-motion'
import CTAButton from './CTAButton'

interface AnnotationsProps {
  section: number
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const annotationStyle: React.CSSProperties = {
  fontFamily: 'var(--font-space-mono), monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#8A8070',
  lineHeight: 1.8,
}

const headlineStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), serif',
  fontStyle: 'italic',
  color: '#0F0C08',
  lineHeight: 1.25,
}

// ─── Leader line SVG ──────────────────────────────────────────────────────────

function LeaderLine({ x1, y1, length = 60 }: { x1: number; y1: number; length?: number }) {
  return (
    <svg
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
      width={length + 8}
      height={8}
    >
      <circle cx={0} cy={4} r={2} fill="#8A8070" />
      <line x1={4} y1={4} x2={length + 4} y2={4} stroke="#8A8070" strokeWidth={0.5} />
    </svg>
  )
}

// ─── Section wrappers ─────────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

function stagger(i: number): React.CSSProperties {
  return { transition: `opacity 0.4s ease ${i * 0.08}s` }
}

// ─── Section 0 ────────────────────────────────────────────────────────────────

function Section0() {
  return (
    <>
      {/* Top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ position: 'absolute', top: '28px', left: '32px', ...annotationStyle }}
      >
        AEVIO AI&nbsp;&nbsp;//&nbsp;&nbsp;INTELLIGENCE SYSTEMS
      </motion.div>

      {/* Top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        style={{ position: 'absolute', top: '28px', right: '32px', ...annotationStyle, textAlign: 'right' }}
      >
        EST. 2026&nbsp;&nbsp;//&nbsp;&nbsp;CZECH REPUBLIC
      </motion.div>

      {/* Bottom-left stack */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.4 }}
        style={{ position: 'absolute', bottom: '80px', left: '32px', ...annotationStyle }}
      >
        <div>NEURAL_NET · ACTIVE</div>
        <div>AGENTS · 7</div>
        <div>STATUS · OPERATIONAL</div>
      </motion.div>

      {/* Leader line + annotation at ~(60%, 35%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.34, duration: 0.4 }}
        style={{ position: 'absolute', left: '60vw', top: '35vh' }}
      >
        <LeaderLine x1={0} y1={4} length={60} />
        <div
          style={{
            position: 'absolute',
            left: '72px',
            top: '-2px',
            ...annotationStyle,
          }}
        >
          <div>SYSTEM_01</div>
          <div>AUTONOMOUS DECISION ENGINE</div>
        </div>
      </motion.div>

      {/* Large headline, centered bottom third */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '18vh',
          left: 0,
          right: 0,
          textAlign: 'center',
          ...headlineStyle,
          fontSize: 'clamp(28px, 4vw, 42px)',
        }}
      >
        <div>Vaše firma.</div>
        <div>Řízená inteligencí.</div>
        <div>Nepřetržitě.</div>
      </motion.div>

      {/* Scroll prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...annotationStyle, fontSize: '11px' }}
        >
          ↓&nbsp;&nbsp;SCROLL TO EXPLORE
        </motion.span>
      </motion.div>
    </>
  )
}

// ─── Section 1 ────────────────────────────────────────────────────────────────

function Section1() {
  return (
    <>
      {/* Center headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          ...headlineStyle,
          fontSize: 'clamp(22px, 3vw, 32px)',
        }}
      >
        Síť agentů která nikdy nespí.
      </motion.div>

      {/* Right annotation with leader line at (65%, 40%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        style={{ position: 'absolute', left: '65vw', top: '40vh' }}
      >
        <LeaderLine x1={0} y1={4} length={50} />
        <div
          style={{
            position: 'absolute',
            left: '62px',
            top: '-2px',
            ...annotationStyle,
          }}
        >
          <div>NEURAL_PATHWAYS · 2,847,392</div>
          <div>DECISIONS_TODAY · 1,204</div>
          <div>UPTIME · 99.97%</div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Section 2 ────────────────────────────────────────────────────────────────

function Section2() {
  return (
    <>
      {/* Left cluster (10%, 50%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ position: 'absolute', left: '10vw', top: '50vh', ...annotationStyle }}
      >
        CEO_AGENT · STRATEGIC COMMAND
      </motion.div>

      {/* Top cluster (50%, 20%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        style={{
          position: 'absolute',
          left: '50vw',
          top: '20vh',
          transform: 'translateX(-50%)',
          ...annotationStyle,
          textAlign: 'center',
        }}
      >
        SALES_AGENT · CLIENT ACQUISITION
      </motion.div>

      {/* Right cluster (80%, 50%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.4 }}
        style={{ position: 'absolute', left: '80vw', top: '50vh', ...annotationStyle }}
      >
        CLIENT_AGENT · RELATIONSHIP MGMT
      </motion.div>

      {/* Center bottom headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '15vh',
          left: 0,
          right: 0,
          textAlign: 'center',
          ...headlineStyle,
          fontSize: 'clamp(24px, 3.5vw, 36px)',
        }}
      >
        <div>Sedm agentů.</div>
        <div>Jeden cíl.</div>
      </motion.div>
    </>
  )
}

// ─── Section 3 ────────────────────────────────────────────────────────────────

function Section3() {
  return (
    <>
      {/* Package A — (20%, 35%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ position: 'absolute', left: '20vw', top: '35vh', ...annotationStyle }}
      >
        <div>PACKAGE_A</div>
        <div style={{ marginTop: '4px', color: '#0F0C08' }}>AI Zákaznický Servis</div>
        <div style={{ marginTop: '2px' }}>18 000 Kč&nbsp;&nbsp;+&nbsp;&nbsp;6 000 Kč / měs</div>
      </motion.div>

      {/* Package B — (50%, 20%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        style={{
          position: 'absolute',
          left: '50vw',
          top: '20vh',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          ...annotationStyle,
        }}
      >
        <div>PACKAGE_B</div>
        <div style={{ marginTop: '4px', color: '#0F0C08' }}>Email Automatizace</div>
        <div style={{ marginTop: '2px' }}>22 000 Kč&nbsp;&nbsp;+&nbsp;&nbsp;8 000 Kč / měs</div>
      </motion.div>

      {/* Package C — (75%, 35%) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: 0.4 }}
        style={{ position: 'absolute', left: '75vw', top: '35vh', ...annotationStyle }}
      >
        <div>PACKAGE_C&nbsp;&nbsp;//&nbsp;&nbsp;RECOMMENDED</div>
        <div style={{ marginTop: '4px', color: '#0F0C08' }}>Kompletní Systém</div>
        <div style={{ marginTop: '2px' }}>35 000 Kč&nbsp;&nbsp;+&nbsp;&nbsp;12 000 Kč / měs</div>
      </motion.div>

      {/* Bottom headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '15vh',
          left: 0,
          right: 0,
          textAlign: 'center',
          ...headlineStyle,
          fontSize: 'clamp(22px, 3vw, 32px)',
        }}
      >
        Vyberte svůj vstupní bod.
      </motion.div>
    </>
  )
}

// ─── Section 4 ────────────────────────────────────────────────────────────────

function Section4() {
  return (
    <>
      {/* Center large headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-60%)',
          textAlign: 'center',
          ...headlineStyle,
          fontSize: 'clamp(36px, 5vw, 52px)',
        }}
      >
        Připraveni?
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'auto',
        }}
      >
        <CTAButton />
      </motion.div>

      {/* Contact info below CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.46, duration: 0.4 }}
        style={{
          position: 'absolute',
          top: 'calc(50% + 80px)',
          left: 0,
          right: 0,
          textAlign: 'center',
          ...annotationStyle,
          fontSize: '10px',
          lineHeight: 2,
        }}
      >
        <div>aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;IČO 88054667</div>
        <div>Aevio AI&nbsp;&nbsp;·&nbsp;&nbsp;Czech Republic&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
      </motion.div>

      {/* Bottom-right GDPR link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.54, duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '28px',
          right: '32px',
          pointerEvents: 'auto',
        }}
      >
        <a
          href="#"
          style={{
            ...annotationStyle,
            fontSize: '10px',
            textDecoration: 'none',
            color: '#8A8070',
          }}
        >
          ↗&nbsp;&nbsp;GDPR Checklist pro e-shopy&nbsp;&nbsp;·&nbsp;&nbsp;990 Kč
        </a>
      </motion.div>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Annotations({ section }: AnnotationsProps) {
  const sections: Record<number, React.ReactNode> = {
    0: <Section0 />,
    1: <Section1 />,
    2: <Section2 />,
    3: <Section3 />,
    4: <Section4 />,
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ position: 'absolute', inset: 0 }}
        >
          {sections[section] ?? null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
