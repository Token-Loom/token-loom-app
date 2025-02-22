'use client'

import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { PublicKey } from '@solana/web3.js'

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
        // Enable mobile web browser deep linking with proper configuration
        mobile: {
          enabled: true,
          getUri: (uri: string) => {
            // Store the current URL before redirecting
            if (typeof window !== 'undefined') {
              localStorage.setItem('phantom_redirect_url', window.location.href)
            }
            return uri
          }
        },
        onAccountChange: (publicKey: PublicKey | null) => {
          if (publicKey) {
            // Update stored public key when account changes
            localStorage.setItem('phantom_public_key', publicKey.toBase58())
          } else {
            localStorage.removeItem('phantom_public_key')
          }
        }
      }),
      new SolflareWalletAdapter()
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
