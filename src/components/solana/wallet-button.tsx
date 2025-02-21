'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WalletButtonProps {
  className?: string
}

export function WalletButton({ className }: WalletButtonProps) {
  const { publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()

  const handleClick = () => {
    if (publicKey) {
      disconnect()
    } else {
      setVisible(true)
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
      {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
