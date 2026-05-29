'use client'
import { motion, AnimatePresence } from 'framer-motion'
import CTAButton from './CTAButton'

interface NodeContentProps {
  node: number // -1=transit, 0=node1, 1=node2, 2=node3, 3=node4, 4=core
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-space-mono), monospace',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
}

const serif: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), serif',
  fontStyle: 'italic',
  color: '#E8E0D0',
  lineHeight: 1.2,
}

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
  exit: { opacity: 0, transition: { duration: 0.4 } },
}

function Node0() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '18%', left: '8%',
          ...serif, fontSize: 'clamp(44px, 5vw, 72px)',
        }}
      >
        <div>Vaše firma.</div>
        <div>Řízená inteligencí.</div>
        <div>Nepřetržitě.</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '10%', left: '8%',
          ...mono, fontSize: '10px', color: '#6A8070',
        }}
      >
        NEURAL_NET · ACTIVE&nbsp;&nbsp;·&nbsp;&nbsp;AGENTS · 7&nbsp;&nbsp;·&nbsp;&nbsp;STATUS · OPERATIONAL
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
        }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ ...mono, fontSize: '11px', color: '#6A8070' }}
        >
          ↓&nbsp;&nbsp;SCROLL TO EXPLORE
        </motion.span>
      </motion.div>
    </>
  )
}

function Node1() {
  const agents = [
    { label: 'CEO · STRATEGIC COMMAND', style: { top: '22%', left: '38%' } },
    { label: 'SALES · CLIENT ACQUISITION', style: { top: '30%', right: '18%' } },
    { label: 'CLIENT · RELATIONSHIP MGMT', style: { top: '50%', right: '10%' } },
    { label: 'DEV · ENGINEERING', style: { bottom: '28%', right: '22%' } },
    { label: 'RESEARCH · INTELLIGENCE', style: { bottom: '22%', left: '30%' } },
    { label: 'FINANCE · OPERATIONS', style: { top: '54%', left: '10%' } },
    { label: 'AUDIT · QUALITY CONTROL', style: { top: '36%', left: '18%' } },
  ]

  return (
    <>
      {agents.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
          style={{
            position: 'absolute',
            ...a.style,
            ...mono, fontSize: '9px', color: '#C8A96E',
          }}
        >
          {a.label}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          top: '50%', left: 0, right: 0,
          transform: 'translateY(-50%)',
          textAlign: 'center',
          ...serif, fontSize: 'clamp(36px, 4vw, 56px)',
          pointerEvents: 'none',
        }}
      >
        <div>Sedm agentů.</div>
        <div>Jeden mozek.</div>
      </motion.div>
    </>
  )
}

function Node2() {
  const packages = [
    {
      id: 'PACKAGE_A',
      name: 'AI Zákaznický Servis',
      price: '18 000 Kč + 6 000 Kč / měs',
      style: { left: '12%', top: '30%' },
    },
    {
      id: 'PACKAGE_B',
      name: 'Email Automatizace',
      price: '22 000 Kč + 8 000 Kč / měs',
      style: { left: '50%', top: '18%', transform: 'translateX(-50%)' },
    },
    {
      id: 'PACKAGE_C // RECOMMENDED',
      name: 'Kompletní Systém',
      price: '35 000 Kč + 12 000 Kč / měs',
      style: { right: '10%', top: '30%' },
    },
  ]

  return (
    <>
      {packages.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.15, duration: 0.6 }}
          style={{ position: 'absolute', ...p.style }}
        >
          <div style={{ ...mono, fontSize: '16px', color: '#6A8070', marginBottom: '8px' }}>{p.id}</div>
          <div style={{ ...mono, fontSize: '22px', color: '#E8E0D0', marginBottom: '8px', textTransform: 'none', letterSpacing: '0.03em' }}>{p.name}</div>
          <div style={{ ...mono, fontSize: '20px', color: '#C8A96E' }}>{p.price}</div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '16%', left: 0, right: 0,
          textAlign: 'center',
          ...serif, fontSize: 'clamp(32px, 3.5vw, 48px)',
        }}
      >
        Vyberte svůj vstupní bod.
      </motion.div>
    </>
  )
}

function Node3() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.9, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%', left: 0, right: 0,
        transform: 'translateY(-50%)',
        textAlign: 'center',
      }}
    >
      <div style={{ ...serif, fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: '24px' }}>
        <div>Systém se učí.</div>
        <div>Roste. Přidává agenty.</div>
        <div>Nikdy se nezastaví.</div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ ...mono, fontSize: '10px', color: '#6A8070' }}
      >
        DNES 7 AGENTŮ&nbsp;&nbsp;·&nbsp;&nbsp;ZÍTRA DESÍTKY&nbsp;&nbsp;·&nbsp;&nbsp;VŽDY AUTONOMNÍ
      </motion.div>
    </motion.div>
  )
}

function CoreContent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 0, pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.0, ease: 'easeOut' }}
          style={{
            ...serif,
            fontSize: 'clamp(56px, 7vw, 96px)',
            textAlign: 'center',
            marginBottom: '44px',
          }}
        >
          Připraveni?
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          style={{ pointerEvents: 'auto', marginBottom: '44px' }}
        >
          <CTAButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          style={{
            ...mono, fontSize: '10px', color: '#4A5A50',
            textAlign: 'center', lineHeight: 2,
            textTransform: 'uppercase', letterSpacing: '0.12em',
          }}
        >
          <div>aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Aevio AI&nbsp;&nbsp;·&nbsp;&nbsp;Czech Republic&nbsp;&nbsp;·&nbsp;&nbsp;2026</div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        style={{
          position: 'absolute', bottom: '28px', right: '32px',
          pointerEvents: 'auto',
        }}
      >
        <a
          href="#"
          style={{
            ...mono, fontSize: '10px', color: '#4A5A50',
            textDecoration: 'none', cursor: 'none',
          }}
        >
          ↗&nbsp;&nbsp;GDPR Checklist pro e-shopy&nbsp;&nbsp;·&nbsp;&nbsp;990 Kč
        </a>
      </motion.div>
    </>
  )
}

export default function NodeContent({ node }: NodeContentProps) {
  // Scroll order (user scrolls UP from core): node4→3→2→1→0
  // 4: no text (page load — just the visual core)
  // 3: hero text (first stop scrolling up)
  // 2: agents
  // 1: packages
  // 0: CTA "Připraveni?" (end of scroll)
  const nodeMap: Record<number, React.ReactNode> = {
    0: <CoreContent />,
    1: <Node2 />,
    2: <Node1 />,
    3: <Node0 />,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      <AnimatePresence mode="wait">
        {node >= 0 && (
          <motion.div
            key={node}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ position: 'absolute', inset: 0 }}
          >
            {nodeMap[node] ?? null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
