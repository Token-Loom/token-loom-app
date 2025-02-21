'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'

const NETWORKS = [
  {
    name: 'Mainnet Beta',
    value: WalletAdapterNetwork.Mainnet,
    endpoint: 'https://mainnet.helius-rpc.com/?api-key=c4e8c2b5-7956-4b5b-82d1-35de5c1068ec'
  }
]

export function NetworkSelector() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(WalletAdapterNetwork.Mainnet)

  useEffect(() => {
    const savedNetwork = localStorage.getItem('network')
    if (savedNetwork) {
      console.log('Loading saved network:', savedNetwork)
      setSelectedNetwork(savedNetwork)
    }
  }, [])

  const handleNetworkChange = (network: string) => {
    if (network !== selectedNetwork) {
      console.log('Switching network to:', network)
      localStorage.setItem('network', network)
      window.location.reload()
    }
  }

  return (
    <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
      <SelectTrigger className='w-[140px]'>
        <SelectValue>{NETWORKS.find(n => n.value === selectedNetwork)?.name || 'Select Network'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map(network => (
          <SelectItem key={network.value} value={network.value}>
            {network.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
