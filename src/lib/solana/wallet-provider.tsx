'use client'

import { FC, ReactNode, useMemo, useEffect } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: ReactNode
}

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  // Set up RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC if provided, otherwise fallback to public endpoint
    return process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  }, [])

  // Initialize supported wallets with mobile configuration
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({
        appIdentity: {
          name: 'ControlledBurn',
          icon: 'https://controlledburn-mx4k.vercel.app/logo.svg',
          url: 'https://controlledburn-mx4k.vercel.app'
        },
        mobile: {
          enabled: true,
          getUri: (uri: string) => {
            if (typeof window !== 'undefined') {
              // Store both the redirect URL and a timestamp to handle stale redirects
              const redirectData = {
                url: window.location.href,
                timestamp: Date.now(),
                connecting: true
              }
              localStorage.setItem('phantom_redirect_data', JSON.stringify(redirectData))
            }
            return uri
          }
        }
      }),
      new SolflareWalletAdapter()
    ],
    []
  )

  // Handle redirect cleanup and reconnection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const redirectData = localStorage.getItem('phantom_redirect_data')
      if (redirectData) {
        try {
          const { timestamp, connecting } = JSON.parse(redirectData)
          // Clear stale redirect data (older than 5 minutes)
          if (Date.now() - timestamp > 5 * 60 * 1000 || !connecting) {
            localStorage.removeItem('phantom_redirect_data')
          }
        } catch {
          localStorage.removeItem('phantom_redirect_data')
        }
      }
    }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={false} // Disable autoConnect to prevent race conditions
        onError={error => {
          console.error('Wallet error:', error)
          // Clear redirect data on error
          localStorage.removeItem('phantom_redirect_data')
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
