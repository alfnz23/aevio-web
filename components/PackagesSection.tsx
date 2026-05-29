'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const PACKAGES = [
  {
    id: 'PACKAGE_A',
    name: 'AI Zákaznický Servis',
    price: '18 000 Kč',
    monthly: '+ 6 000 Kč / měs',
    features: ['24/7 chat bez přestávky', 'Napojení na Shoptet / WooCommerce', 'Detekce záměru zákazníka'],
    enter: { x: -80, opacity: 0 },
    recommended: false,
  },
  {
    id: 'PACKAGE_B',
    name: 'Email Automatizace',
    price: '22 000 Kč',
    monthly: '+ 8 000 Kč / měs',
    features: ['Personalizované sekvence', 'Segmentace zákazníků', 'A/B testování předmětů'],
    enter: { y: 60, opacity: 0 },
    recommended: false,
  },
  {
    id: 'PACKAGE_C // RECOMMENDED',
    name: 'Kompletní Systém',
    price: '35 000 Kč',
    monthly: '+ 12 000 Kč / měs',
    features: ['Všechny moduly', '7 AI agentů aktivních', 'CEO orchestrace'],
    enter: { x: 80, opacity: 0 },
    recommended: true,
  },
]

function PackageCard({ pkg, delay }: { pkg: typeof PACKAGES[0]; delay: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={pkg.enter}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        flex: '1 1 260px',
        maxWidth: 340,
        padding: '36px 32px',
        background: hovered
          ? 'rgba(200,169,110,0.08)'
          : pkg.recommended
            ? 'rgba(200,169,110,0.06)'
            : 'rgba(200,169,110,0.04)',
        border: `1px solid ${hovered || pkg.recommended ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.15)'}`,
        backdropFilter: 'blur(12px)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        cursor: 'none',
      }}
    >
      {pkg.recommended && (
        <div style={{
          position: 'absolute', top: -1, right: 28,
          fontFamily: 'var(--font-space-mono)', fontSize: '8px',
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8A96E',
          background: '#030810', padding: '4px 8px',
          border: '1px solid rgba(200,169,110,0.4)',
          borderTop: 'none',
        }}>
          RECOMMENDED
        </div>
      )}

      <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 16 }}>
        {pkg.id}
      </div>

      <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'clamp(18px, 1.8vw, 24px)', color: '#E8E0D0', marginBottom: 24, lineHeight: 1.3 }}>
        {pkg.name}
      </div>

      <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: 'clamp(20px, 2.2vw, 28px)', color: '#C8A96E', marginBottom: 6 }}>
        {pkg.price}
      </div>
      <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#6A8070', marginBottom: 28 }}>
        {pkg.monthly}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pkg.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: '#C8A96E', flexShrink: 0, marginTop: 1 }}>—</span>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: '#6A8070', letterSpacing: '0.06em' }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 0%, rgba(200,169,110,0.12) 0%, transparent 65%)',
        }}
      />
    </motion.div>
  )
}

export default function PackagesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%', background: '#030810', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* Background radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '70vw', height: '70vh', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(200,169,110,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 20 }}
      >
        INTELLIGENCE PACKAGES
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-playfair)', fontStyle: 'italic',
          fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#E8E0D0',
          textAlign: 'center', marginBottom: 52, lineHeight: 1.2,
        }}
      >
        Vyberte svůj vstupní bod.
      </motion.div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px', width: '100%', maxWidth: 1100 }}>
        {PACKAGES.map((pkg, i) => (
          <PackageCard key={pkg.id} pkg={pkg} delay={0.4 + i * 0.15} />
        ))}
      </div>
    </div>
  )
}
