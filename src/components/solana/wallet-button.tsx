'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
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

interface PhantomAdapter {
  publicKey: PublicKey | null
  connected: boolean
  name: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connected, select, wallets } = useWallet()
  const { setVisible } = useWalletModal()
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const addDebugLog = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    console.log(isError ? 'Error:' : 'Debug:', message)
    setDebugLogs(prev => [...prev.slice(-8), logMessage]) // Keep last 9 messages
    if (isError) {
      setError(message)
    }
  }

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    try {
      const checkPhantom = () => {
        const isAvailable = checkForPhantom()
        setIsPhantomAvailable(isAvailable)
        addDebugLog(`Phantom check - Available: ${isAvailable}`)
        addDebugLog(`Window.phantom: ${!!window.phantom}`)
        addDebugLog(`Mobile device: ${isMobileDevice()}`)
      }

      setIsMobile(isMobileDevice())
      addDebugLog('Debug overlay active')
      addDebugLog(`Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'}`)
      addDebugLog(`Screen: ${window.innerWidth}x${window.innerHeight}`)
      checkPhantom()

      // Add orientation change listener
      const handleOrientationChange = () => {
        addDebugLog(`Orientation changed: ${window.innerWidth}x${window.innerHeight}`)
        checkPhantom()
      }

      window.addEventListener('orientationchange', handleOrientationChange)
      window.addEventListener('resize', handleOrientationChange)

      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('resize', handleOrientationChange)
      }
    } catch (error) {
      addDebugLog(`Init error: ${error instanceof Error ? error.message : 'Unknown error'}`, true)
    }
  }, [])

  const handleDisconnect = useCallback(async () => {
    try {
      localStorage.removeItem('phantom_public_key')
      disconnect()
      addDebugLog('Disconnected successfully')
    } catch (error) {
      addDebugLog(`Disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`, true)
    }
  }, [disconnect])

  // Handle Phantom connection response
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      // Check if we're returning from a Phantom connection
      const url = window.location.href
      addDebugLog(`Checking URL: ${url.slice(0, 50)}...`)

      if (url.includes('phantom_encryption_public_key')) {
        addDebugLog('Found Phantom response')
        const response = handlePhantomResponse(url, addDebugLog)

        if (response) {
          addDebugLog(`Got public key: ${response.publicKey.slice(0, 10)}...`)

          // Clean up the URL by removing Phantom's parameters
          const cleanUrl = `${window.location.origin}${window.location.pathname}`
          window.history.replaceState({}, '', cleanUrl)

          // Store public key
          localStorage.setItem('phantom_public_key', response.publicKey)

          // Update wallet adapter state
          if (isMobile) {
            const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
            if (!phantomWallet) {
              throw new Error('Phantom wallet not found in adapter list')
            }

            addDebugLog('Found Phantom wallet adapter')
            select(phantomWallet.adapter.name)
            addDebugLog('Selected Phantom wallet')

            // Force connection state
            const publicKey = new PublicKey(response.publicKey)
            const adapter = phantomWallet.adapter as unknown as PhantomAdapter
            adapter.publicKey = publicKey
            adapter.connected = true
            addDebugLog('Set connection state')
          } else {
            const provider = getPhantomProvider()
            if (provider) {
              addDebugLog('Connecting to provider...')
              provider
                .connect()
                .then(() => {
                  addDebugLog('Connected successfully')
                })
                .catch(error => {
                  addDebugLog(`Provider error: ${error.message}`, true)
                  localStorage.removeItem('phantom_public_key')
                })
            } else {
              addDebugLog('No provider found (expected on mobile)')
            }
          }
        } else {
          addDebugLog('Failed to handle response', true)
        }
      }
    } catch (error) {
      addDebugLog(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, true)
    }
  }, [isMobile, select, wallets])

  const handleClick = () => {
    try {
      clearError()
      if (connected) {
        handleDisconnect()
      } else if (isMobile) {
        // On mobile, always use deep linking
        addDebugLog('Initiating mobile deep link...')
        addDebugLog(`Current URL: ${window.location.href}`)
        connectPhantomMobile()
      } else if (isPhantomAvailable) {
        // On desktop with Phantom installed, use wallet adapter
        setVisible(true)
      } else {
        // If Phantom is not installed, redirect to install page
        window.open('https://phantom.app/', '_blank')
      }
    } catch (error) {
      addDebugLog(`Click error: ${error instanceof Error ? error.message : 'Unknown error'}`, true)
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
      <div className='fixed top-16 left-0 right-0 bg-black/90 text-white p-2 text-xs font-mono z-[100] border-t border-purple-500'>
        <div className='max-w-full overflow-y-auto max-h-48'>
          {error && (
            <div className='bg-red-900/50 p-2 mb-2 rounded border border-red-500 whitespace-pre-wrap break-words'>
              Error: {error}
            </div>
          )}
          {debugLogs.map((log, i) => (
            <div key={i} className='whitespace-pre-wrap break-words'>
              {log}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
