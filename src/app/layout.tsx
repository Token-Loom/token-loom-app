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
  metadataBase: new URL('https://tokenloom.io'),
  title: {
    default: 'TokenLoom - Secure Solana Token Burning Service',
    template: '%s | TokenLoom'
  },
  description:
    'TokenLoom is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
  keywords: ['Solana', 'token burning', 'cryptocurrency', 'blockchain', 'DeFi', 'token management', 'controlled burn'],
  applicationName: 'TokenLoom',
  authors: [{ name: 'TokenLoom Team' }],
  creator: 'TokenLoom Team',
  publisher: 'TokenLoom',
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
    url: 'https://tokenloom.io',
    siteName: 'TokenLoom',
    title: 'TokenLoom - Secure Solana Token Burning Service',
    description:
      'TokenLoom is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'TokenLoom - Secure Solana Token Burning Service'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TokenLoom - Secure Solana Token Burning Service',
    description:
      'TokenLoom is a secure and intuitive token burning service for Solana-based tokens. Schedule controlled burns, monitor transactions, and manage your token supply efficiently.',
    images: ['/og.png'],
    creator: '@tokenloom',
    site: '@tokenloom'
  },
  verification: {
    google: 'your-google-site-verification'
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico'
  },
  alternates: {
    canonical: 'https://tokenloom.io'
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
