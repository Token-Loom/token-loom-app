import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { RootLayout } from '@/components/layout/root-layout'
import { SolanaWalletProvider } from '@/lib/solana/wallet-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL('https://controlledburn.io'),
  title: {
    default: 'ControlledBurn - Secure Solana Token Burning Service',
    template: '%s | ControlledBurn'
  },
  description:
    'ControlledBurn is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
  keywords: ['Solana', 'token burning', 'cryptocurrency', 'blockchain', 'DeFi', 'token management', 'controlled burn'],
  authors: [{ name: 'ControlledBurn Team' }],
  creator: 'ControlledBurn Team',
  publisher: 'ControlledBurn',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://controlledburn.io',
    siteName: 'ControlledBurn',
    title: 'ControlledBurn - Secure Solana Token Burning Service',
    description:
      'ControlledBurn is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ControlledBurn - Secure Solana Token Burning Service'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ControlledBurn - Secure Solana Token Burning Service',
    description:
      'ControlledBurn is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
    images: ['/og-image.png'],
    creator: '@controlledburn',
    site: '@controlledburn'
  },
  verification: {
    google: 'your-google-site-verification'
  },
  alternates: {
    canonical: 'https://controlledburn.io'
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SolanaWalletProvider>
          <RootLayout>{children}</RootLayout>
          <Toaster />
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
