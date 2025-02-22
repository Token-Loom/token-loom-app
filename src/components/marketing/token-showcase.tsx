import { Card } from '@/components/ui/card'
import Image from 'next/image'

const tokens = [
  {
    name: 'SolToken',
    symbol: 'SOL',
    totalBurned: '500,000',
    recentBurns: '25,000',
    logo: '/tokens/sol.png'
  },
  {
    name: 'DefiCoin',
    symbol: 'DFI',
    totalBurned: '1,200,000',
    recentBurns: '45,000',
    logo: '/tokens/defi.png'
  },
  {
    name: 'GameFi',
    symbol: 'GAME',
    totalBurned: '750,000',
    recentBurns: '30,000',
    logo: '/tokens/game.png'
  },
  {
    name: 'NFTToken',
    symbol: 'NFT',
    totalBurned: '300,000',
    recentBurns: '15,000',
    logo: '/tokens/nft.png'
  }
]

export function TokenShowcase() {
  return (
    <section className='py-16'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>Featured Tokens</h2>
          <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
            Explore some of the top tokens that have utilized our platform for their burning needs.
          </p>
        </div>

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {tokens.map(token => (
            <Card key={token.symbol} className='group relative overflow-hidden bg-[#1E1E24] p-6'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='relative h-10 w-10'>
                  <Image src={token.logo} alt={token.name} fill className='rounded-full object-cover' />
                </div>
                <div>
                  <h3 className='font-semibold text-[#E6E6E6]'>{token.name}</h3>
                  <p className='text-sm text-[#A3A3A3]'>{token.symbol}</p>
                </div>
              </div>
              <div className='space-y-2'>
                <div>
                  <p className='text-sm text-[#A3A3A3]'>Total Burned</p>
                  <p className='text-lg font-semibold text-[#14F195]'>{token.totalBurned}</p>
                </div>
                <div>
                  <p className='text-sm text-[#A3A3A3]'>Recent Burns</p>
                  <p className='text-lg font-semibold text-[#00C2FF]'>{token.recentBurns}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
