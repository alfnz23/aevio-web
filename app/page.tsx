'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Annotations from '@/components/Annotations'
import Navigation from '@/components/Navigation'
import LoadingScreen from '@/components/LoadingScreen'

// Dynamic imports — Three.js and browser APIs cannot run on server
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <div style={{ background: '#F2EDE6', height: '100vh' }} />,
})

const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

export default function Home() {
  const [section, setSection] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Simulate load progress — reaches 1.0 to trigger onComplete in LoadingScreen
  useEffect(() => {
    if (loaded) return
    const start = Date.now()
    const duration = 2200 // ms
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setLoadProgress(p)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [loaded])

  const handleLoadComplete = () => {
    setLoadProgress(1)
    setTimeout(() => setLoaded(true), 400)
  }

  if (isMobile) {
    return (
      <main style={{ backgroundColor: '#F2EDE6', minHeight: '100vh', padding: '0' }}>
        {/* Mobile: static layout with hero image */}
        <div style={{
          width: '100%', height: '100vh',
          backgroundImage: 'url(/hero-mobile.svg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundColor: '#F2EDE6',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px 24px',
          gap: '16px',
        }}>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8A8070' }}>
            AEVIO AI&nbsp;&nbsp;//&nbsp;&nbsp;INTELLIGENCE SYSTEMS
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: '36px', lineHeight: 1.2, color: '#0F0C08' }}>
            Vaše firma.<br />Řízená inteligencí.<br />Nepřetržitě.
          </h1>
          <a href="mailto:aevioai@gmail.com" style={{
            display: 'inline-block', width: '100%',
            padding: '16px', marginTop: '8px',
            border: '1px solid #8A8070',
            backgroundColor: 'transparent', color: '#0F0C08',
            fontFamily: 'var(--font-space-mono)', fontSize: '11px',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', textAlign: 'center',
          }}>
            DOMLUVIT BEZPLATNÝ AUDIT
          </a>
          <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: '#8A8070', textAlign: 'center' }}>
            aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;IČO 88054667
          </p>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Loading screen — shown until Three.js ready */}
      {!loaded && (
        <LoadingScreen
          progress={loadProgress}
          onComplete={handleLoadComplete}
        />
      )}

      {/* Three.js scene — fixed full viewport canvas */}
      <Scene onSectionChange={setSection} />

      {/* Scroll spacer — gives GSAP room to work */}
      <div id="scroll-spacer" style={{ height: '600vh' }} />

      {/* UI overlays — above canvas */}
      {loaded && (
        <>
          <Navigation visible={loaded} />
          <Annotations section={section} />
          <Cursor />
        </>
      )}
    </>
  )
}
