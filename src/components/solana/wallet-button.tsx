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

  useEffect(() => {
    setIsPhantomAvailable(checkForPhantom())
    setIsMobile(isMobileDevice())

    // Restore session if exists
    const savedSession = sessionStorage.getItem('phantom_session')
    if (savedSession) {
      setSession(savedSession)
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
    if (url.includes('phantom_encryption_public_key')) {
      const response = handlePhantomResponse(url)
      if (response) {
        // Clean up the URL
        window.history.replaceState({}, '', window.location.origin)

        // Store session
        sessionStorage.setItem('phantom_session', response.session)
        setSession(response.session)

        // Update wallet adapter state by connecting through provider
        const provider = getPhantomProvider()
        if (provider) {
          provider.connect({ onlyIfTrusted: true }).catch(error => console.error('Error connecting to Phantom:', error))
        }
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
  )
}
