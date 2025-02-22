import { PublicKey, Transaction } from '@solana/web3.js'

interface SolflareProvider {
  isSolflare?: boolean
  publicKey?: PublicKey
  isConnected?: boolean
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  solana?: {
    isSolflare: boolean
    connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
    disconnect: () => Promise<void>
  }
}

declare global {
  interface Window {
    solflare?: SolflareProvider
  }
}

// Function to check if Solflare wallet is available
export const checkForSolflare = (): boolean => {
  if (typeof window === 'undefined') return false
  // On desktop, check for the injected provider
  const provider = window.solflare?.solana
  const hasProvider = provider?.isSolflare || false
  console.log('Solflare check:', {
    hasSolflare: 'solflare' in window,
    hasProvider: !!provider,
    isSolflare: provider?.isSolflare
  })
  return hasProvider
}

// Function to get the Solflare provider
export const getSolflareProvider = (): SolflareProvider['solana'] | null => {
  if (typeof window === 'undefined') return null
  console.log('Getting Solflare provider:', {
    hasSolflare: 'solflare' in window,
    provider: window.solflare?.solana
  })
  if ('solflare' in window) {
    const provider = window.solflare?.solana
    if (provider?.isSolflare) {
      return provider
    }
  }
  return null
}
