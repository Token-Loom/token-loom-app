import { Card, CardContent } from '@/components/ui/card'

export function HowItWorks() {
  return (
    <div className='container py-24'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='font-display mb-4 text-3xl font-bold tracking-tight text-[#E6E6E6] sm:text-4xl'>How It Works</h2>
        <p className='text-lg text-[#E6E6E6]/60'>
          Simple, secure, and transparent token burning for both regular and LP tokens.
        </p>
      </div>
      <div className='mx-auto mt-16 max-w-5xl'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-transparent' />
            <CardContent className='relative p-6'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#9945FF]/10 text-[#9945FF]'>
                1
              </div>
              <h3 className='mb-2 font-display text-xl font-bold text-[#E6E6E6]'>Connect Wallet</h3>
              <p className='text-[#E6E6E6]/60'>
                Connect your Solana wallet containing the tokens you want to burn. We support both Phantom and Solflare.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#14F195]/5 to-transparent' />
            <CardContent className='relative p-6'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#14F195]/10 text-[#14F195]'>
                2
              </div>
              <h3 className='mb-2 font-display text-xl font-bold text-[#E6E6E6]'>Select Tokens</h3>
              <p className='text-[#E6E6E6]/60'>
                Choose the tokens you want to burn. We support both regular tokens and LP tokens from major Solana DEXes
                like Raydium and Orca.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#00C2FF]/5 to-transparent' />
            <CardContent className='relative p-6'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00C2FF]/10 text-[#00C2FF]'>
                3
              </div>
              <h3 className='mb-2 font-display text-xl font-bold text-[#E6E6E6]'>Choose Burn Type</h3>
              <p className='text-[#E6E6E6]/60'>
                Select between instant burns or controlled burns with scheduling. Both options available for regular and
                LP tokens.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur sm:col-span-2 lg:col-span-3'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 via-[#14F195]/5 to-[#00C2FF]/5' />
            <CardContent className='relative p-6'>
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#9945FF]/10 via-[#14F195]/10 to-[#00C2FF]/10 text-[#E6E6E6]'>
                ✓
              </div>
              <h3 className='mb-2 font-display text-xl font-bold text-[#E6E6E6]'>Monitor & Verify</h3>
              <p className='text-[#E6E6E6]/60'>
                Track your burn transactions in real-time through our dashboard. All burns are verifiable on-chain and
                come with detailed transaction history.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
