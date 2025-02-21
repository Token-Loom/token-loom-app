import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Banner() {
  return (
    <section className='relative min-h-[80vh] overflow-hidden py-24 bg-[#13141F]'>
      <div className='container relative z-10 flex min-h-[calc(80vh-160px)] flex-col items-center justify-center'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='font-display mb-6 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-4xl font-bold text-transparent leading-normal sm:text-6xl sm:leading-tight'>
            Reduce Supply.
            <br />
            Increase Value.
            <br />
            Burn with Confidence.
          </h1>
          <p className='mb-8 text-lg text-[#E6E6E6] sm:text-xl'>
            The most secure and transparent way to burn Solana tokens. Supports both regular tokens and LP tokens with
            advanced scheduling and controlled burns.
          </p>
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <Link href='/burn'>
              <Button
                size='lg'
                className='min-w-[150px] bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-md hover:opacity-90 sm:w-auto'
              >
                Start Burning
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Enhanced layered background effect */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#9945FF]/30 via-[#14F195]/10 to-transparent' />
      <div className='absolute inset-0 bg-[linear-gradient(45deg,_#9945FF10_1px,transparent_1px),linear-gradient(-45deg,_#14F19510_1px,transparent_1px)] bg-[size:24px_24px]' />
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#13141F]/80 to-[#13141F]' />
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/30 to-transparent' />
    </section>
  )
}
