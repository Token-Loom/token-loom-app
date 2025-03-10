'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import { isMobileDevice, connectPhantomMobile } from '@/lib/solana/phantom-deeplink'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connected, select, wallets } = useWallet()
  const { setVisible } = useWalletModal()
  const [isMobile, setIsMobile] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const mobile = isMobileDevice()
      setIsMobile(mobile)
    }

    // Initial check
    checkDevice()

    // Handle orientation and screen changes
    window.addEventListener('orientationchange', checkDevice)
    window.addEventListener('resize', checkDevice)

    // Some foldable devices emit a 'resize' event when folded/unfolded
    if ('screen' in window && 'orientation' in window.screen) {
      window.screen.orientation.addEventListener('change', checkDevice)
    }

    return () => {
      window.removeEventListener('orientationchange', checkDevice)
      window.removeEventListener('resize', checkDevice)
      if ('screen' in window && 'orientation' in window.screen) {
        window.screen.orientation.removeEventListener('change', checkDevice)
      }
    }
  }, [isMobile, connected])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Handle connection response
    const searchParams = new URLSearchParams(window.location.search)
    const phantomPublicKey = searchParams.get('phantom_public_key')
    const redirectUrl = localStorage.getItem('phantom_redirect_url')

    if (phantomPublicKey) {
      // Clean up URL and localStorage
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete('phantom_public_key')
      window.history.replaceState({}, '', currentUrl.toString())
      localStorage.removeItem('phantom_redirect_url')

      // Connect wallet
      const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
      if (phantomWallet) {
        setIsConnecting(true)
        Promise.resolve(select(phantomWallet.adapter.name))
          .catch(console.error)
          .finally(() => setIsConnecting(false))
      }
    } else if (redirectUrl) {
      // If we have a redirect URL but no public key, clean up
      localStorage.removeItem('phantom_redirect_url')
    }
  }, [select, wallets])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      localStorage.removeItem('phantom_public_key')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }, [disconnect])

  const handleClick = () => {
    if (connected) {
      handleDisconnect()
    } else if (isConnecting) {
      return // Prevent multiple connection attempts
    } else if (!isMobile) {
      // On desktop, always show the wallet selection modal
      setVisible(true)
    } else {
      // On mobile, use Phantom's mobile flow
      setIsConnecting(true)
      try {
        connectPhantomMobile()
      } catch (error) {
        console.error('Error connecting to Phantom mobile:', error)
        setIsConnecting(false)
      }
    }
  }

  return (
    <Button
      variant='outline'
      className={cn(
        'border-[#9945FF] bg-transparent text-[#9945FF] hover:bg-[#9945FF] hover:text-[#E6E6E6]',
        isConnecting && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={isConnecting}
    >
      {connected && publicKey
        ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
        : isConnecting
          ? 'Connecting...'
          : 'Connect Wallet'}
    </Button>
  )
}
