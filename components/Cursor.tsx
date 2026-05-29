'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    let animId: number
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 12}px, ${ring.current.y - 12}px)`
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => {
      if (ringRef.current) Object.assign(ringRef.current.style, { width: '36px', height: '36px' })
    }
    const onLeave = () => {
      if (ringRef.current) Object.assign(ringRef.current.style, { width: '24px', height: '24px' })
    }
    const els = document.querySelectorAll('a, button, [role=button]')
    els.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      els.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 8, height: 8, borderRadius: '50%',
        backgroundColor: '#C8A96E',
        pointerEvents: 'none', zIndex: 9998, willChange: 'transform',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 24, height: 24, borderRadius: '50%',
        border: '1px solid rgba(200,169,110,0.5)',
        pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
        transition: 'width 0.2s ease, height 0.2s ease',
      }} />
    </>
  )
}
