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

interface PhantomWalletAdapter {
  publicKey?: PublicKey
  connected?: boolean
}

export function WalletButton({ className }: WalletButtonProps) {
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev.slice(-4), message]) // Keep last 5 messages
  }

  useEffect(() => {
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
  }, [])

  const handleDisconnect = useCallback(async () => {
    // Clear storage
    localStorage.removeItem('phantom_session')
    localStorage.removeItem('phantom_public_key')

    // Reset wallet adapter state
    if (isMobile) {
      wallet.disconnect()
    } else {
      // If on desktop, we need to handle disconnect through Phantom
      const provider = getPhantomProvider()
      if (provider) {
        try {
          await provider.disconnect()
        } catch (error) {
          console.error('Error disconnecting from Phantom:', error)
        }
      }
      wallet.disconnect()
    }
  }, [wallet, isMobile])

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

        // Store public key
        localStorage.setItem('phantom_public_key', response.publicKey)

        // Update wallet adapter state
        if (isMobile) {
          try {
            // Set the wallet adapter state directly
            const publicKey = new PublicKey(response.publicKey)
            // Force the wallet to be connected with the public key
            const phantomWallet = wallet.wallets.find(w => w.adapter.name === 'Phantom')
            if (phantomWallet) {
              wallet.select(phantomWallet.adapter.name)
              const adapter = phantomWallet.adapter as unknown as PhantomWalletAdapter
              adapter.publicKey = publicKey
              adapter.connected = true
              addDebugLog('Mobile connection successful')
            } else {
              addDebugLog('Phantom wallet not found in adapter list')
            }
          } catch (error) {
            addDebugLog(`Error setting wallet state: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
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
                addDebugLog(`Error: ${error.message}`)
                // Clear storage if connection fails
                localStorage.removeItem('phantom_session')
                localStorage.removeItem('phantom_public_key')
              })
          } else {
            addDebugLog('No provider found (expected on mobile)')
          }
        }
      } else {
        addDebugLog('Failed to handle response')
      }
    }
  }, [wallet, isMobile])

  const handleClick = () => {
    if (wallet.connected) {
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
        {wallet.connected && wallet.publicKey
          ? `${wallet.publicKey.toString().slice(0, 4)}...${wallet.publicKey.toString().slice(-4)}`
          : 'Connect Wallet'}
      </Button>
      {/* Debug Overlay */}
      <div className='fixed bottom-16 left-4 right-4 bg-black/80 text-white p-2 text-xs font-mono z-50 rounded-lg mb-4 max-h-32 overflow-y-auto'>
        <div className='max-w-full'>
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
