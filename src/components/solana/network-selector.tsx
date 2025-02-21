'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'

interface Network {
  name: string
  value: WalletAdapterNetwork
  endpoint: string
}

const networks: Network[] = [
  {
    name: 'Mainnet',
    value: WalletAdapterNetwork.Mainnet,
    endpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'
  }
]

export function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(WalletAdapterNetwork.Mainnet)

  useEffect(() => {
    const savedNetwork = localStorage.getItem('network')
    if (savedNetwork) {
      setSelectedNetwork(savedNetwork)
    }
  }, [])

  const handleNetworkChange = (network: string) => {
    if (network !== selectedNetwork) {
      localStorage.setItem('network', network)
      window.location.reload()
    }
  }

  return (
    <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
      <SelectTrigger className='w-[140px]'>
        <SelectValue>{networks.find(n => n.value === selectedNetwork)?.name || 'Select Network'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {networks.map(network => (
          <SelectItem key={network.value} value={network.value}>
            {network.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
