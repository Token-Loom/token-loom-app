import { Card, CardContent } from '@/components/ui/card'

export function HowItWorks() {
  return (
    <div className='container mt-[140px] sm:mt-[240px]'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
          How It Works
        </h2>
        <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
          Simple, secure, and transparent token burning for both regular and LP tokens.
        </p>
      </div>
      <div className='mx-auto mt-8 sm:mt-16 max-w-5xl'>
        <div className='grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-transparent' />
            <CardContent className='relative p-4 sm:p-6'>
              <div className='mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#9945FF]/10 text-[#9945FF] text-xl sm:text-2xl'>
                1
              </div>
              <h3 className='mb-2 font-display text-lg sm:text-xl font-bold text-[#E6E6E6]'>Connect Wallet</h3>
              <p className='text-sm sm:text-base text-[#E6E6E6]/60'>
                Connect your Solana wallet containing the tokens you want to burn. We support both Phantom and Solflare.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#14F195]/5 to-transparent' />
            <CardContent className='relative p-4 sm:p-6'>
              <div className='mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#14F195]/10 text-[#14F195] text-xl sm:text-2xl'>
                2
              </div>
              <h3 className='mb-2 font-display text-lg sm:text-xl font-bold text-[#E6E6E6]'>Select Tokens</h3>
              <p className='text-sm sm:text-base text-[#E6E6E6]/60'>
                Choose the tokens you want to burn. We support both regular tokens and LP tokens from major Solana DEXes
                like Raydium and Orca.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#00C2FF]/5 to-transparent' />
            <CardContent className='relative p-4 sm:p-6'>
              <div className='mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#00C2FF]/10 text-[#00C2FF] text-xl sm:text-2xl'>
                3
              </div>
              <h3 className='mb-2 font-display text-lg sm:text-xl font-bold text-[#E6E6E6]'>Choose Burn Type</h3>
              <p className='text-sm sm:text-base text-[#E6E6E6]/60'>
                Select between instant burns or controlled burns with scheduling. Both options available for regular and
                LP tokens.
              </p>
            </CardContent>
          </Card>

          <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur sm:col-span-2 lg:col-span-3'>
            <div className='absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 via-[#14F195]/5 to-[#00C2FF]/5' />
            <CardContent className='relative p-4 sm:p-6'>
              <div className='mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#9945FF]/10 via-[#14F195]/10 to-[#00C2FF]/10 text-[#E6E6E6] text-xl sm:text-2xl'>
                ✓
              </div>
              <h3 className='mb-2 font-display text-lg sm:text-xl font-bold text-[#E6E6E6]'>Monitor & Verify</h3>
              <p className='text-sm sm:text-base text-[#E6E6E6]/60'>
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
