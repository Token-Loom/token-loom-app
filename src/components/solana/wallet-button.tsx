'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState, useCallback } from 'react'
import { checkForPhantom, isMobileDevice, connectPhantomMobile } from '@/lib/solana/phantom-deeplink'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connected, select, wallets } = useWallet()
  const { setVisible } = useWalletModal()
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkPhantom = () => {
      const isAvailable = checkForPhantom()
      setIsPhantomAvailable(isAvailable)
    }

    const checkDevice = () => {
      setIsMobile(isMobileDevice())
      checkPhantom()
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
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Handle connection response
    const searchParams = new URLSearchParams(window.location.search)
    const phantomPublicKey = searchParams.get('phantom_public_key')

    if (phantomPublicKey) {
      // Clean up URL
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.delete('phantom_public_key')
      window.history.replaceState({}, '', currentUrl.toString())

      // Connect wallet
      const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
      if (phantomWallet) {
        select(phantomWallet.adapter.name)
      }
    }
  }, [select, wallets])

  const handleDisconnect = useCallback(async () => {
    disconnect()
  }, [disconnect])

  const handleClick = () => {
    if (connected) {
      handleDisconnect()
    } else if (isMobile) {
      connectPhantomMobile()
    } else if (isPhantomAvailable) {
      setVisible(true)
    } else {
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
