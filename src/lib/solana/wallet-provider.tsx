'use client'

import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: ReactNode
}

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  // Get network from localStorage or use mainnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    const MAINNET_RPC = 'https://mainnet.helius-rpc.com/?api-key=c4e8c2b5-7956-4b5b-82d1-35de5c1068ec'

    // Use custom RPC if provided
    const customRPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT
    if (customRPC) {
      console.log('Using custom RPC:', customRPC)
      return customRPC
    }

    console.log('Using Helius RPC for mainnet')
    return MAINNET_RPC
  }, [])

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
