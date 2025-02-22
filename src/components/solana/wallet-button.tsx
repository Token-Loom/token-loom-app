'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import { isMobileDevice, handlePhantomResponse, getPhantomProvider } from '@/lib/solana/phantom-deeplink'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev.slice(-4), message]) // Keep last 5 messages
  }

  useEffect(() => {
    setIsMobile(isMobileDevice())
    addDebugLog('Debug overlay active')
    addDebugLog(`Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'}`)
    addDebugLog(`URL: ${window.location.href.slice(0, 30)}...`)

    // Restore session if exists
    const savedSession = sessionStorage.getItem('phantom_session')
    if (savedSession) {
      setSession(savedSession)
      addDebugLog('Session restored')
    }
  }, [])

  const handleDisconnect = useCallback(async () => {
    // Clear session
    sessionStorage.removeItem('phantom_session')
    setSession(null)

    // If on mobile, we need to handle disconnect through Phantom
    if (isMobile && session) {
      const provider = getPhantomProvider()
      if (provider) {
        try {
          await provider.disconnect()
        } catch (error) {
          console.error('Error disconnecting from Phantom:', error)
        }
      }
    }

    // Use wallet adapter disconnect
    disconnect()
  }, [disconnect, isMobile, session])

  // Handle Phantom connection response
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if we're returning from a Phantom connection
    const url = window.location.href
    addDebugLog(`Checking URL: ${url.slice(0, 50)}...`)

    if (url.includes('phantom_encryption_public_key')) {
      addDebugLog('Found Phantom response')
      const response = handlePhantomResponse(url, addDebugLog)

      if (response) {
        addDebugLog(`Got public key: ${response.publicKey.slice(0, 10)}...`)
        // Clean up the URL
        window.history.replaceState({}, '', window.location.origin)

        // Store session
        sessionStorage.setItem('phantom_session', response.session)
        setSession(response.session)

        // Update wallet adapter state by connecting through provider
        const provider = getPhantomProvider()

        if (provider) {
          addDebugLog('Connecting to provider...')
          provider
            .connect()
            .then(() => {
              addDebugLog('Connected successfully')
            })
            .catch(error => {
              addDebugLog(`Error: ${error.message}`)
              // Clear session if connection fails
              sessionStorage.removeItem('phantom_session')
              setSession(null)
            })
        } else {
          addDebugLog('No provider found')
        }
      } else {
        addDebugLog('Failed to handle response')
      }
    }
  }, [])

  const handleClick = () => {
    if (connected) {
      handleDisconnect()
    } else {
      // Always use wallet adapter connect
      setVisible(true)
    }
  }

  return (
    <>
      <Button
        variant='outline'
        className={cn(
          'border-[#9945FF] bg-transparent text-[#9945FF] hover:bg-[#9945FF] hover:text-[#E6E6E6]',
          className
        )}
        onClick={handleClick}
      >
        {connected && publicKey
          ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
          : 'Connect Wallet'}
      </Button>
      {/* Debug Overlay - removed isMobile check temporarily */}
      <div className='fixed h-[660px] top-20 left-4 right-4 bg-black text-white p-4 text-sm font-mono z-50 rounded-lg shadow-lg border border-purple-500'>
        <div className='max-w-full'>
          <div className='font-bold mb-2'>Debug Logs:</div>
          {debugLogs.map((log, i) => (
            <div key={i} className='whitespace-pre-wrap break-words mb-1'>
              {log}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
