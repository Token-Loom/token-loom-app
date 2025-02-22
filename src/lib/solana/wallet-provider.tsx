'use client'

import { FC, ReactNode, useMemo, useEffect, useCallback } from 'react'
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

  // Handle redirect after wallet connection
  const handleRedirect = useCallback((uri: string) => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      console.log('Storing return URL:', currentUrl)
      localStorage.setItem('wallet_adapter_return_url', currentUrl)
    }
    return uri
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
          getUri: handleRedirect
        }
      }),
      new SolflareWalletAdapter()
    ],
    [handleRedirect]
  )

  // Handle return from wallet connection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const returnUrl = localStorage.getItem('wallet_adapter_return_url')
      if (returnUrl) {
        console.log('Returning from wallet connection, stored URL:', returnUrl)
        localStorage.removeItem('wallet_adapter_return_url')
      }
    }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={error => {
          console.error('Wallet connection error:', error)
        }}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
