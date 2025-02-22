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
  const [isConnecting, setIsConnecting] = useState(false)

  // Mobile-friendly debug logger
  const logDebug = useCallback((message: string, data?: unknown) => {
    const timestamp = new Date().toLocaleTimeString()
    const fullMessage = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) : ''}`
    setDebugMessage(prev => `${fullMessage}\n\n${prev || ''}`)
    console.log(fullMessage)
  }, [])

  // Set up RPC endpoint
  const endpoint = useMemo(() => {
    return process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  }, [])

  // Clear all wallet-related storage
  const clearWalletStorage = useCallback(() => {
    if (typeof window === 'undefined') return

    logDebug('Clearing wallet storage')

    // First log all existing wallet-related items
    const existingItems: Record<string, string | null> = {}
    Object.keys(localStorage).forEach(key => {
      if (key.includes('phantom') || key.includes('wallet')) {
        existingItems[key] = localStorage.getItem(key)
      }
    })
    logDebug('Existing wallet items', existingItems)

    // Clear items
    localStorage.removeItem(WALLET_STATE_KEY)
    localStorage.removeItem('wallet_adapter_return_url')
    localStorage.removeItem('walletName')

    // Clear Phantom-specific states
    const clearedKeys: string[] = []
    Object.keys(localStorage).forEach(key => {
      if (key.includes('phantom') || key.includes('wallet')) {
        localStorage.removeItem(key)
        clearedKeys.push(key)
      }
    })
    logDebug('Cleared storage keys', { keys: clearedKeys })

    setIsConnecting(false)
  }, [logDebug])

  // Handle redirect after wallet connection
  const handleRedirect = useCallback(
    (uri: string) => {
      if (typeof window === 'undefined') return uri

      setIsConnecting(true)
      const currentUrl = window.location.href

      logDebug('Starting wallet connection', {
        currentUrl,
        uri,
        userAgent: window.navigator.userAgent,
        hasPhantom: !!window.solana,
        phantomState: window.solana?.isPhantom
      })

      // Store connection state with device info
      const connectionState = {
        timestamp: Date.now(),
        returnUrl: currentUrl,
        connecting: true,
        isMobile: /iPhone|iPad|Android/i.test(window.navigator.userAgent),
        uri,
        needsApproval: true // Flag to indicate this is a new connection
      }
      localStorage.setItem(WALLET_STATE_KEY, JSON.stringify(connectionState))
      localStorage.setItem('wallet_adapter_return_url', currentUrl)

      return uri
    },
    [logDebug]
  )

  // Initialize supported wallets with mobile configuration
  const wallets = useMemo(() => {
    const phantomWallet = new PhantomWalletAdapter({
      appIdentity: {
        name: 'ControlledBurn',
        icon: 'https://controlledburn-mx4k.vercel.app/logo.svg',
        url: 'https://controlledburn-mx4k.vercel.app'
      },
      mobile: {
        enabled: true,
        getUri: handleRedirect
      }
    })

    // Log wallet state changes
    phantomWallet.on('readyStateChange', (readyState: string) => {
      logDebug('Phantom wallet state changed', {
        readyState,
        connected: phantomWallet.connected,
        connecting: phantomWallet.connecting,
        publicKey: phantomWallet.publicKey?.toBase58()
      })
    })

    return [phantomWallet, new SolflareWalletAdapter()]
  }, [handleRedirect, logDebug])

  // Attempt to connect to Phantom
  const connectPhantom = useCallback(async () => {
    if (!window.solana?.isPhantom) {
      logDebug('Phantom not found')
      return
    }

    try {
      logDebug('Attempting to connect to Phantom')
      // First try trusted connection
      try {
        await window.solana.connect({ onlyIfTrusted: true })
        logDebug('Connected with trusted connection')
        setIsConnecting(false)
        return
      } catch {
        logDebug('Trusted connection failed, trying regular connect')
      }

      // If trusted fails, try regular connect
      await window.solana.connect()
      logDebug('Connected with regular connection')
      setIsConnecting(false)
    } catch (error) {
      logDebug('Error connecting to Phantom', { error: error instanceof Error ? error.message : String(error) })
      clearWalletStorage()
    }
  }, [logDebug, clearWalletStorage])

  // Handle connection lifecycle
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleConnectionReturn = () => {
      try {
        const stateStr = localStorage.getItem(WALLET_STATE_KEY)
        const returnUrl = localStorage.getItem('wallet_adapter_return_url')

        logDebug('Checking connection state', {
          hasState: !!stateStr,
          returnUrl,
          currentUrl: window.location.href,
          hasPhantom: !!window.solana,
          phantomState: window.solana?.isPhantom,
          isConnecting,
          state: stateStr ? JSON.parse(stateStr) : null
        })

        if (stateStr) {
          const state = JSON.parse(stateStr)
          const elapsed = Date.now() - state.timestamp

          if (elapsed > 5 * 60 * 1000) {
            logDebug('Clearing stale connection state', { elapsed })
            clearWalletStorage()
          } else if (state.connecting && window.solana?.isPhantom) {
            // Use the state's connecting flag instead of component state
            setIsConnecting(true)
            connectPhantom()
          }
        }
      } catch (error) {
        logDebug('Error handling connection', { error: error instanceof Error ? error.message : String(error) })
        clearWalletStorage()
      }
    }

    // Check connection state immediately and after a short delay
    handleConnectionReturn()
    const immediateCheck = setTimeout(handleConnectionReturn, 100)
    const delayedCheck = setTimeout(handleConnectionReturn, 1000)

    // Check on focus and visibility changes
    window.addEventListener('focus', handleConnectionReturn)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleConnectionReturn()
      }
    })

    return () => {
      clearTimeout(immediateCheck)
      clearTimeout(delayedCheck)
      window.removeEventListener('focus', handleConnectionReturn)
      window.removeEventListener('visibilitychange', handleConnectionReturn)
    }
  }, [clearWalletStorage, logDebug, isConnecting, connectPhantom])

  // Handle initial mount
  useEffect(() => {
    const stateStr = localStorage.getItem(WALLET_STATE_KEY)
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr)
        if (state.connecting) {
          setIsConnecting(true)
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={false}
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
