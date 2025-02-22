'use client'

import { FC, ReactNode, useMemo, useEffect, useCallback, useState } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: ReactNode
}

const WALLET_STATE_KEY = 'controlled_burn_wallet_state'

// Debug toast component for mobile
const DebugToast: FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className='fixed bottom-4 left-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 text-sm'>
    <pre className='whitespace-pre-wrap break-words'>{message}</pre>
    <button onClick={onClose} className='absolute top-2 right-2 text-white/60 hover:text-white'>
      ✕
    </button>
  </div>
)

export const SolanaWalletProvider: FC<Props> = ({ children }) => {
  const [debugMessage, setDebugMessage] = useState<string | null>(null)

  // Mobile-friendly debug logger
  const logDebug = useCallback((message: string, data?: unknown) => {
    const timestamp = new Date().toLocaleTimeString()
    const fullMessage = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) : ''}`
    setDebugMessage(fullMessage)
    console.log(fullMessage) // Keep console.log for desktop debugging
  }, [])

  // Set up RPC endpoint
  const endpoint = useMemo(() => {
    // Use custom RPC if provided, otherwise fallback to public endpoint
    return process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  }, [])

  // Clear all wallet-related storage
  const clearWalletStorage = useCallback(() => {
    if (typeof window === 'undefined') return

    logDebug('Clearing wallet storage')
    // Clear our custom state
    localStorage.removeItem(WALLET_STATE_KEY)
    // Clear wallet adapter states
    localStorage.removeItem('wallet_adapter_return_url')
    localStorage.removeItem('walletName')
    // Clear Phantom-specific states
    const clearedKeys: string[] = []
    Object.keys(localStorage).forEach(key => {
      if (key.includes('phantom') || key.includes('wallet')) {
        console.log('Removing:', key)
        localStorage.removeItem(key)
        clearedKeys.push(key)
      }
    })
    logDebug('Cleared storage keys', { keys: clearedKeys })
  }, [logDebug])

  // Handle redirect after wallet connection
  const handleRedirect = useCallback(
    (uri: string) => {
      if (typeof window === 'undefined') return uri

      const currentUrl = window.location.href
      logDebug('Wallet connection redirect', {
        currentUrl,
        uri,
        userAgent: window.navigator.userAgent
      })

      // Store connection state with device info
      const connectionState = {
        timestamp: Date.now(),
        returnUrl: currentUrl,
        connecting: true,
        isMobile: /iPhone|iPad|Android/i.test(window.navigator.userAgent)
      }
      localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(connectionState))
      localStorage.setItem('wallet_adapter_return_url', currentUrl)

      return uri
    },
    [logDebug]
  )

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

  // Handle connection lifecycle
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleConnectionReturn = () => {
      try {
        logDebug('Checking connection state')
        const stateStr = localStorage.getItem(WALLET_STATE_KEY)
        const returnUrl = localStorage.getItem('wallet_adapter_return_url')

        if (stateStr) {
          const state = JSON.parse(stateStr)
          const elapsed = Date.now() - state.timestamp

          logDebug('Connection state', {
            state,
            elapsed,
            returnUrl,
            currentUrl: window.location.href
          })

          // If connection attempt is too old or completed
          if (elapsed > 5 * 60 * 1000 || !state.connecting) {
            logDebug('Clearing stale connection state')
            clearWalletStorage()
          }
        }
      } catch (error) {
        logDebug('Error handling connection', { error: error instanceof Error ? error.message : String(error) })
        clearWalletStorage()
      }
    }

    // Check connection state on mount and focus
    handleConnectionReturn()
    window.addEventListener('focus', handleConnectionReturn)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleConnectionReturn()
      }
    })

    return () => {
      window.removeEventListener('focus', handleConnectionReturn)
      window.removeEventListener('visibilitychange', handleConnectionReturn)
    }
  }, [clearWalletStorage, logDebug])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        onError={error => {
          logDebug('Wallet error', { error: error instanceof Error ? error.message : String(error) })
          clearWalletStorage()
        }}
      >
        <WalletModalProvider>
          {children}
          {debugMessage && <DebugToast message={debugMessage} onClose={() => setDebugMessage(null)} />}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
