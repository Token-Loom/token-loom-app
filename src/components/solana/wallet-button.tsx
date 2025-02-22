'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const handleClick = () => {
    if (publicKey) {
      disconnect()
    } else {
      // On mobile, we want to ensure the modal appears in a mobile-friendly way
      if (isMobile) {
        // Small delay to ensure proper modal rendering on mobile
        setTimeout(() => setVisible(true), 50)
      } else {
        setVisible(true)
      }
    }
  }

  return (
    <Button
      variant='outline'
      className={cn(
        'border-[#9945FF] bg-transparent text-[#9945FF] hover:bg-[#9945FF] hover:text-[#E6E6E6] relative',
        connecting && 'cursor-not-allowed opacity-70',
        isMobile && 'w-full sm:w-auto', // Full width on mobile
        className
      )}
      onClick={handleClick}
      disabled={connecting}
    >
      {connecting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {publicKey
        ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
        : isMobile
          ? 'Connect Mobile Wallet'
          : 'Connect Wallet'}
    </Button>
  )
}
