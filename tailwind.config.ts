import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F2EDE6',
        obsidian: '#1A1208',
        gold: '#C8A96E',
        'text-primary': '#0F0C08',
        annotation: '#8A8070',
        highlight: '#D4A85A',
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'monospace'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
