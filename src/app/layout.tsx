import type { Metadata } from 'next'
import { RootLayout } from '@/components/layout/root-layout'
import { SolanaWalletProvider } from '@/lib/solana/wallet-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'ControlledBurn - Solana Token Burning Service',
  description: 'A secure and intuitive token burning service for Solana-based tokens'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='dark'>
      <body>
        <SolanaWalletProvider>
          <RootLayout>{children}</RootLayout>
          <Toaster />
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
