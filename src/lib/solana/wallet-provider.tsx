'use client'

import { FC, ReactNode, useMemo, useCallback } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { WalletError } from '@solana/wallet-adapter-base'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

const config: WalletAdapterNetwork = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || 'mainnet-beta'

// Default RPC endpoints for different networks
const DEFAULT_RPC_ENDPOINTS = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com'
}

export const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = useMemo(() => config, [])

  const endpoint = useMemo(() => {
    const customEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    if (customEndpoint?.startsWith('http')) {
      return customEndpoint
    }
    return DEFAULT_RPC_ENDPOINTS[network] || DEFAULT_RPC_ENDPOINTS['mainnet-beta']
  }, [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    [network]
  )

  const onError = useCallback((error: WalletError) => {
    console.error(error)
    // Use console.error for now since we don't have the toast component
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
