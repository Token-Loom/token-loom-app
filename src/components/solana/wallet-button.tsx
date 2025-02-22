'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import {
  checkForPhantom,
  isMobileDevice,
  connectPhantomMobile,
  handlePhantomResponse,
  getPhantomProvider
} from '@/lib/solana/phantom-deeplink'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [session, setSession] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = (message: string) => {
    console.log('Debug:', message) // Also log to console
    setDebugLogs(prev => {
      const timestamp = new Date().toLocaleTimeString()
      return [...prev, `[${timestamp}] ${message}`].slice(-15) // Keep last 15 messages
    })
  }

  useEffect(() => {
    setIsPhantomAvailable(checkForPhantom())
    setIsMobile(isMobileDevice())
    addDebugLog('Debug overlay active')
    addDebugLog(`Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'}`)
    addDebugLog(`Phantom Available: ${checkForPhantom()}`)
    addDebugLog(`URL: ${window.location.href}`)

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
    addDebugLog(`Current URL: ${url}`)

    // Check for both direct parameters and hash parameters
    const hasPhantomParams = url.includes('phantom_encryption_public_key')

    if (hasPhantomParams) {
      addDebugLog('Found Phantom response parameters')

      // Get the raw URL without any hash
      const baseUrl = url.split('#')[0]
      addDebugLog(`Processing URL: ${baseUrl}`)

      const response = handlePhantomResponse(baseUrl, addDebugLog)

      if (response) {
        addDebugLog(`Got public key: ${response.publicKey.slice(0, 10)}...`)

        // Clean up the URL
        window.history.replaceState({}, '', window.location.origin)

        // Store session
        sessionStorage.setItem('phantom_session', response.session)
        setSession(response.session)

        // Wait for Phantom provider to be available
        const checkAndConnect = async () => {
          addDebugLog('Waiting for Phantom provider...')
          // Try for up to 5 seconds
          for (let i = 0; i < 10; i++) {
            const provider = getPhantomProvider()
            if (provider) {
              addDebugLog('Found provider, connecting...')
              try {
                const result = await provider.connect()
                addDebugLog(`Connected successfully: ${result.publicKey.toString()}`)
                // Force a refresh of isPhantomAvailable
                setIsPhantomAvailable(true)
                return
              } catch (error) {
                addDebugLog(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`)
              }
            }
            addDebugLog('Provider not found, retrying...')
            // Wait 500ms before trying again
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          addDebugLog('Failed to find Phantom provider after timeout')
        }

        checkAndConnect()
      } else {
        addDebugLog('Failed to handle response')
      }
    }
  }, [])

  const handleClick = () => {
    if (connected) {
      handleDisconnect()
    } else if (isMobile) {
      // On mobile, use deep linking
      connectPhantomMobile()
    } else if (isPhantomAvailable) {
      // On desktop with Phantom installed, use wallet adapter
      setVisible(true)
    } else {
      // If Phantom is not installed, redirect to install page
      window.open('https://phantom.app/', '_blank')
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
      {/* Debug Overlay */}
      <div className='fixed top-10 bottom-4 left-4 right-4 max-w-xl mx-auto bg-black/90 text-white p-4 text-xs font-mono z-50 rounded-lg shadow-lg border border-purple-500 max-h-[50vh] overflow-y-auto'>
        <div className='max-w-full'>
          <div className='font-bold mb-2 text-purple-400'>Debug Logs:</div>
          {debugLogs.map((log, i) => (
            <div key={i} className='whitespace-pre-wrap break-words mb-1 opacity-90 hover:opacity-100'>
              {log}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
