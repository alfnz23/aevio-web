'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import LoadingScreen from '@/components/LoadingScreen'
import NodeContent from '@/components/NodeContent'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <div style={{ background: '#030810', height: '100vh' }} />,
})

const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

export default function Home() {
  const [currentNode, setCurrentNode] = useState(-1)
  const [loadProgress, setLoadProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Simulate load progress — reaches 1.0 to trigger onComplete
  useEffect(() => {
    if (loaded) return
    const start = Date.now()
    const duration = 2600
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setLoadProgress(p)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [loaded])

  const handleLoadComplete = useCallback(() => {
    setLoadProgress(1)
    setTimeout(() => setLoaded(true), 400)
  }, [])

  const handleNodeChange = useCallback((node: number) => {
    setCurrentNode(node)
  }, [])

  if (isMobile) {
    return <MobileLayout />
  }

  return (
    <>
      {!loaded && (
        <LoadingScreen progress={loadProgress} onComplete={handleLoadComplete} />
      )}

      <Scene onNodeChange={handleNodeChange} />

      {/* Scroll spacer — gives GSAP 1000vh to scrub camera path t: 0→1 */}
      <div id="scroll-spacer" style={{ height: '1000vh', position: 'relative', zIndex: 2, pointerEvents: 'none' }} />

      {loaded && (
        <>
          <Navigation visible />
          <NodeContent node={currentNode} />
          <Cursor />
        </>
      )}
    </>
  )
}

function MobileLayout() {
  return (
    <main style={{ backgroundColor: '#030810', minHeight: '100vh' }}>
      <div style={{
        width: '100%', height: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '40px 24px',
        gap: '20px',
        background: 'radial-gradient(ellipse at center, #0D2B45 0%, #030810 70%)',
      }}>
        <p style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '10px', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#6A8070',
        }}>
          AEVIO AI&nbsp;&nbsp;//&nbsp;&nbsp;INTELLIGENCE SYSTEMS
        </p>
        <h1 style={{
          fontFamily: 'var(--font-playfair), serif',
          fontStyle: 'italic', fontSize: '38px',
          lineHeight: 1.2, color: '#E8E0D0',
        }}>
          Vaše firma.<br />Řízená inteligencí.<br />Nepřetržitě.
        </h1>
        <a href="mailto:aevioai@gmail.com" style={{
          display: 'inline-block', width: '100%',
          padding: '18px', marginTop: '8px',
          border: '1px solid rgba(200,169,110,0.6)',
          backgroundColor: 'transparent', color: '#C8A96E',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '12px', letterSpacing: '0.15em',
          textTransform: 'uppercase', textDecoration: 'none',
          textAlign: 'center',
        }}>
          DOMLUVIT BEZPLATNÝ AUDIT
        </a>
        <p style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '10px', color: '#4A5A50', textAlign: 'center',
        }}>
          aevioai@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;IČO 88054667
        </p>
      </div>
    </main>
  )
}
