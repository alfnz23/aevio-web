'use client'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import NodeContent from '@/components/NodeContent'
import IntroOverlay from '@/components/IntroOverlay'

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })
const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

// ─── Mobile fallback ──────────────────────────────────────────────────────────

function MobileLayout() {
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
          aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;Aevio AI&nbsp;&nbsp;·&nbsp;&nbsp;Czech Republic&nbsp;&nbsp;·&nbsp;&nbsp;2026
        </p>
      </div>
    </main>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)
  const [activeNode, setActiveNode] = useState(-1)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Simulate loading progress while scene initializes
  useEffect(() => {
    if (isMobile) return
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 0.18 + 0.04
      if (p >= 1) { p = 1; clearInterval(iv) }
      setLoadProgress(p)
    }, 80)
    return () => clearInterval(iv)
  }, [isMobile])

  const handleNodeChange = useCallback((node: number) => {
    setActiveNode(node)
  }, [])

  const handleLoadComplete = useCallback(() => {
    setSceneReady(true)
  }, [])

  if (isMobile) return <MobileLayout />

  return (
    <>
      <LoadingScreen progress={loadProgress} onComplete={handleLoadComplete} />

      {/* Fixed Three.js canvas */}
      <Scene onNodeChange={handleNodeChange} />

      {/* Intro overlay — visible after loader, dismissed on first scroll */}
      <IntroOverlay show={sceneReady} />

      {/* Framer Motion HTML overlay — node content */}
      <NodeContent node={activeNode} />

      {/* Tall scroll spacer drives GSAP ScrollTrigger camera path */}
      <div id="scroll-spacer" style={{ height: '1000vh', position: 'relative', zIndex: 0 }} />

      <Cursor />
    </>
  )
}
