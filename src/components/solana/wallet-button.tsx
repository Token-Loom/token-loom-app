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

  useEffect(() => {
    const checkPhantom = () => {
      const isAvailable = checkForPhantom()
      setIsPhantomAvailable(isAvailable)
    }

    setIsMobile(isMobileDevice())
    checkPhantom()

    const handleOrientationChange = () => {
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
    localStorage.removeItem('phantom_public_key')
    disconnect()
  }, [disconnect])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const url = window.location.href

    if (url.includes('phantom_encryption_public_key')) {
      const response = handlePhantomResponse(url)

      if (response) {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.delete('phantom_encryption_public_key')
        currentUrl.searchParams.delete('data')
        currentUrl.searchParams.delete('nonce')
        currentUrl.searchParams.delete('errorCode')
        currentUrl.searchParams.delete('errorMessage')

        window.history.replaceState({}, '', currentUrl.toString())

        localStorage.setItem('phantom_public_key', response.publicKey)

        if (isMobile) {
          const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom')
          if (!phantomWallet) {
            throw new Error('Phantom wallet not found in adapter list')
          }

          select(phantomWallet.adapter.name)

          const publicKey = new PublicKey(response.publicKey)
          const adapter = phantomWallet.adapter as unknown as PhantomAdapter
          adapter.publicKey = publicKey
          adapter.connected = true
        } else {
          const provider = getPhantomProvider()
          if (provider) {
            provider.connect().catch(() => {
              localStorage.removeItem('phantom_public_key')
            })
          }
        }
      }
    }
  }, [isMobile, select, wallets])

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
