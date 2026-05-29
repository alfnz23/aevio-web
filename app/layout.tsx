import type { Metadata } from 'next'
import { Space_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aevio AI — Intelligence Systems',
  description: 'Autonomní AI agenti pro české e-commerce. Zákaznický servis, prodej a operace bez přestávky.',
  keywords: 'AI, e-commerce, automatizace, zákaznický servis, Czech',
  openGraph: {
    title: 'Aevio AI — Intelligence Systems',
    description: 'Vaše firma. Řízená inteligencí. Nepřetržitě.',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className={`${spaceMono.variable} ${playfair.variable}`}>
      <body className="bg-cream text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
