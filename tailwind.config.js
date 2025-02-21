import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
  			border: 'hsl(240 3.7% 15.9%)',
  			input: 'hsl(240 3.7% 15.9%)',
  			ring: 'hsl(142.1 70.6% 45.3%)',
  			background: '#13141F',
  			foreground: '#E6E6E6',
  			primary: {
  				DEFAULT: '#9945FF',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#14F195',
  				foreground: '#000000'
  			},
  			accent: {
  				DEFAULT: '#00C2FF',
  				foreground: '#ffffff'
  			},
  			destructive: {
  				DEFAULT: '#FF8F00',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: '#1E1E24',
  				foreground: '#A3A3A3'
  			},
  			surface: '#1E1E24'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
                    ...fontFamily.sans
                ],
  			display: [
  				'var(--font-space-grotesk)',
                    ...fontFamily.sans
                ],
  			mono: [
  				'var(--font-jetbrains-mono)',
                    ...fontFamily.mono
                ]
  		},
  		keyframes: {
  			'glow-pulse': {
  				'0%, 100%': {
  					opacity: 1
  				},
  				'50%': {
  					opacity: 0.5
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [import('tailwindcss-animate'), require("tailwindcss-animate")],
} 