import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(153,69,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(153,69,255,0.5)' }
        }
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite'
      }
    }
  },
  plugins: [animate]
} satisfies Config

export default config
