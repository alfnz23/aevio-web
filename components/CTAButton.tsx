'use client'
import { useState } from 'react'

export default function CTAButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="mailto:aevioai@gmail.com"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: '20px 52px',
        border: '1px solid rgba(200,169,110,0.6)',
        backgroundColor: hovered ? '#C8A96E' : 'transparent',
        color: hovered ? '#030810' : '#C8A96E',
        fontFamily: 'var(--font-space-mono), monospace',
        fontSize: '13px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'none',
        transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
        borderColor: hovered ? '#C8A96E' : 'rgba(200,169,110,0.6)',
      }}
    >
      DOMLUVIT BEZPLATNÝ AUDIT
    </a>
  )
}
