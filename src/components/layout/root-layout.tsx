'use client'

import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Navigation } from './navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
})

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-[#13141F] text-[#E6E6E6]',
        'font-sans antialiased',
        inter.variable,
        spaceGrotesk.variable,
        jetbrainsMono.variable
      )}
    >
      <Navigation />
      <main className='flex min-h-screen flex-col pt-16'>{children}</main>
    </div>
  )
}
