'use client'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AgentsSection from '@/components/AgentsSection'
import PackagesSection from '@/components/PackagesSection'
import GrowthSection from '@/components/GrowthSection'
import CTASection from '@/components/CTASection'

const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

// Wrapper that zooms in as it enters the viewport — "camera fly through" feel
function ScrollSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [1.06, 1, 1, 0.96])
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} id={id} style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <motion.div style={{ scale, opacity, width: '100%', height: '100%' }}>
        {children}
      </motion.div>
    </div>
  )
}

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileLayout() {
  const sections = [
    {
      headline: ['Vaše firma.', 'Řízená inteligencí.', 'Nepřetržitě.'],
      label: 'NEURAL_NET · ACTIVE · AGENTS · 7',
      cta: false,
    },
  ]

  return (
    <main style={{ backgroundColor: '#030810', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ padding: '80px 24px 48px', borderBottom: '1px solid rgba(200,169,110,0.1)' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 24 }}>
          AEVIO AI&nbsp;&nbsp;//&nbsp;&nbsp;INTELLIGENCE SYSTEMS
        </p>
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 38, lineHeight: 1.25, color: '#E8E0D0', marginBottom: 24 }}>
          Vaše firma.<br />Řízená inteligencí.<br />Nepřetržitě.
        </h1>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 36 }}>
          NEURAL_NET · ACTIVE&nbsp;&nbsp;·&nbsp;&nbsp;AGENTS · 7
        </p>
        <a href="mailto:aevioai@gmail.com" style={{ display: 'block', padding: '18px', border: '1px solid rgba(200,169,110,0.55)', backgroundColor: 'transparent', color: '#C8A96E', fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center' }}>
          DOMLUVIT BEZPLATNÝ AUDIT
        </a>
      </div>

      {/* Packages */}
      <div style={{ padding: '48px 24px' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 28 }}>PACKAGES</p>
        {[
          { id: 'A', name: 'AI Zákaznický Servis', price: '18 000 Kč + 6 000 Kč / měs' },
          { id: 'B', name: 'Email Automatizace', price: '22 000 Kč + 8 000 Kč / měs' },
          { id: 'C', name: 'Kompletní Systém', price: '35 000 Kč + 12 000 Kč / měs', rec: true },
        ].map(p => (
          <div key={p.id} style={{ padding: '20px', border: `1px solid ${p.rec ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.15)'}`, marginBottom: 12, background: 'rgba(200,169,110,0.04)' }}>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6A8070', marginBottom: 8 }}>PACKAGE_{p.id}{p.rec ? ' // RECOMMENDED' : ''}</div>
            <div style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 18, color: '#E8E0D0', marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#C8A96E' }}>{p.price}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(200,169,110,0.1)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: '#4A5A50', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;IČO 88054667
        </p>
      </div>
    </main>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  // Render mobile fallback client-side only
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return <MobileLayout />
  }

  return (
    <>
      <Navigation />

      <ScrollSection id="hero">
        <HeroSection />
      </ScrollSection>

      <ScrollSection id="agents">
        <AgentsSection />
      </ScrollSection>

      <ScrollSection id="packages">
        <PackagesSection />
      </ScrollSection>

      <ScrollSection id="growth">
        <GrowthSection />
      </ScrollSection>

      <ScrollSection id="cta">
        <CTASection />
      </ScrollSection>

      <Cursor />
    </>
  )
}
