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
  handlePhantomResponse
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

  const addDebugLog = (message: string) => {
    console.log('Debug:', message)
    setDebugLogs(prev => [...prev.slice(-4), message])
  }

  // Check for saved connection state on mount
  useEffect(() => {
    const savedPublicKey = localStorage.getItem('phantom_public_key')
    if (savedPublicKey && !connected) {
      try {
        const publicKey = new PublicKey(savedPublicKey)
        const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
        if (phantomWallet) {
          addDebugLog('Restoring saved connection')
          select(phantomWallet.adapter.name)
          const adapter = phantomWallet.adapter as unknown as PhantomAdapter
          adapter.publicKey = publicKey
          adapter.connected = true
          addDebugLog('Connection restored')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        addDebugLog(`Failed to restore connection: ${errorMessage}`)
        localStorage.removeItem('phantom_public_key')
      }
    }
  }, [wallets, select, connected])

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

    // Check for Phantom response on page load
    const url = window.location.href
    if (url.includes('phantom_encryption_public_key')) {
      addDebugLog('Found Phantom response')
      const response = handlePhantomResponse(url, addDebugLog)

      if (response) {
        addDebugLog(`Got public key: ${response.publicKey.slice(0, 10)}...`)

        // Get the original URL we were on
        const redirectUrl = localStorage.getItem('phantom_redirect_url')

        // Clean up storage
        localStorage.removeItem('phantom_redirect_url')

        // Clean up the URL and restore original path
        if (redirectUrl) {
          window.history.replaceState({}, '', redirectUrl)
        } else {
          window.history.replaceState({}, '', window.location.origin)
        }

        // Store public key for connection restoration
        localStorage.setItem('phantom_public_key', response.publicKey)

        // Update wallet adapter state
        const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
        if (phantomWallet) {
          addDebugLog('Found Phantom wallet adapter')
          select(phantomWallet.adapter.name)
          const adapter = phantomWallet.adapter as unknown as PhantomAdapter
          adapter.publicKey = new PublicKey(response.publicKey)
          adapter.connected = true
          addDebugLog('Set connection state')
        }
      }
    }
  }, [wallets, select])

  const handleDisconnect = useCallback(() => {
    localStorage.removeItem('phantom_public_key')
    disconnect()
    addDebugLog('Disconnected')
  }, [disconnect])

  const handleClick = () => {
    if (connected) {
      handleDisconnect()
    } else if (isMobile) {
      addDebugLog('Initiating mobile deep link...')
      addDebugLog(`Current URL: ${window.location.href}`)
      connectPhantomMobile()
    } else if (isPhantomAvailable) {
      setVisible(true)
    } else {
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
      <div className='fixed h-[600px] top-16 left-0 right-0 bg-black/80 text-white p-2 text-xs font-mono z-[100] border-t border-purple-500'>
        <div className='max-w-full overflow-y-auto max-h-32'>
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
