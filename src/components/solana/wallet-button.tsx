'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'

export function WalletButton() {
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
      className='border-[#9945FF] bg-transparent text-[#9945FF] hover:bg-[#9945FF] hover:text-[#E6E6E6]'
      onClick={handleClick}
    >
      {publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
