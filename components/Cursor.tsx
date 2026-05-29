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

    // Lerp ring toward mouse
    let animId: number
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 12}px, ${ring.current.y - 12}px)`
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    // Scale ring on hover over interactive elements
    const onEnter = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '40px'
        ringRef.current.style.height = '40px'
        ringRef.current.style.marginLeft = '-8px'
        ringRef.current.style.marginTop = '-8px'
      }
    }
    const onLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '24px'
        ringRef.current.style.height = '24px'
        ringRef.current.style.marginLeft = '0'
        ringRef.current.style.marginTop = '0'
      }
    }
    const interactives = document.querySelectorAll('a, button, [role=button]')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  const dotStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#8A8070',
    pointerEvents: 'none',
    zIndex: 9998,
    willChange: 'transform',
  }

  const ringStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '1px solid #8A8070',
    pointerEvents: 'none',
    zIndex: 9997,
    willChange: 'transform',
    transition: 'width 0.2s ease, height 0.2s ease',
  }

  return (
    <>
      <div ref={dotRef} style={dotStyle} />
      <div ref={ringRef} style={ringStyle} />
    </>
  )
}
