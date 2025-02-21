import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BurnStatistics } from '@/components/marketing/burn-statistics'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Benefits } from '@/components/marketing/benefits'
import { FAQ } from '@/components/marketing/faq'
import { Transparency } from '@/components/marketing/transparency'

export default function Home() {
  return (
    <main className='min-h-screen bg-[#13141F]'>
      {/* Banner Section */}
      <section className='relative min-h-[80vh] overflow-hidden py-20'>
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
              The most secure and transparent way to burn Solana tokens. Take control of your token&apos;s supply with
              our advanced burning platform.
            </p>
            <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
              <Link href='/burn'>
                <Button
                  size='lg'
                  className='min-w-[150px] bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-md hover:opacity-90 sm:w-auto'
                >
                  Burn
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Enhanced gradient background effect */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#9945FF]/20 via-[#14F195]/5 to-transparent' />
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent' />
      </section>

      {/* Fee Information */}
      <section className='relative bg-[#1E1E24] py-24'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-[#14F195]/5 to-transparent' />
        <div className='container relative'>
          <div className='mx-auto max-w-4xl text-center'>
            <h2 className='font-display mb-4 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
              Simple, Transparent Pricing
            </h2>
            <p className='mx-auto mb-12 max-w-2xl text-[#A3A3A3] sm:text-lg'>
              Choose between immediate execution or controlled scheduling. One simple fee, no hidden costs.
            </p>
            <div className='grid gap-8 sm:grid-cols-2'>
              <div className='group relative overflow-hidden rounded-2xl border border-[#9945FF]/20 bg-[#13141F]/50 p-8 backdrop-blur-xl transition-all hover:border-[#9945FF]/40'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                <div className='relative'>
                  <div className='mb-4 inline-block rounded-lg bg-[#9945FF]/10 px-4 py-2'>
                    <h3 className='font-display text-xl font-bold text-[#9945FF]'>Immediate Burn</h3>
                  </div>
                  <div className='mb-6'>
                    <div className='text-4xl font-bold text-[#E6E6E6]'>0.1 SOL</div>
                    <p className='text-[#A3A3A3]'>per transaction</p>
                  </div>
                  <ul className='space-y-4 text-left text-[#E6E6E6]'>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Instant execution
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Real-time confirmation
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Single transaction
                    </li>
                  </ul>
                </div>
              </div>
              <div className='group relative overflow-hidden rounded-2xl border border-[#14F195]/20 bg-[#13141F]/50 p-8 backdrop-blur-xl transition-all hover:border-[#14F195]/40'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#14F195]/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
                <div className='relative'>
                  <div className='mb-4 inline-block rounded-lg bg-[#14F195]/10 px-4 py-2'>
                    <h3 className='font-display text-xl font-bold text-[#14F195]'>Controlled Burn</h3>
                  </div>
                  <div className='mb-6'>
                    <div className='text-4xl font-bold text-[#E6E6E6]'>0.2 SOL</div>
                    <p className='text-[#A3A3A3]'>one-time fee</p>
                  </div>
                  <ul className='space-y-4 text-left text-[#E6E6E6]'>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Schedule multiple burns
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Automated execution
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='mr-2 h-5 w-5 text-[#14F195]'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                      </svg>
                      Unlimited burn schedule
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics */}
      <section className='relative bg-[#13141F] py-24'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
        <div className='container relative'>
          <div className='mx-auto max-w-6xl'>
            <BurnStatistics />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='relative bg-[#1E1E24] py-24'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#14F195]/5 via-transparent to-transparent' />
        <div className='container relative'>
          <div className='mx-auto max-w-6xl'>
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className='relative bg-[#13141F] py-24'>
        <div className='absolute inset-0 bg-[linear-gradient(45deg,_#9945FF05_1px,transparent_1px),linear-gradient(-45deg,_#14F19505_1px,transparent_1px)] bg-[size:32px_32px]' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
        <div className='container relative'>
          <div className='mx-auto max-w-6xl'>
            <Benefits />
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className='relative bg-[#1E1E24] py-24'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#14F195]/10 via-[#9945FF]/5 to-transparent opacity-60' />
        <div className='absolute inset-0 bg-[linear-gradient(45deg,_#14F19505_1px,transparent_1px),linear-gradient(-45deg,_#9945FF05_1px,transparent_1px)] bg-[size:32px_32px]' />
        <div className='container relative'>
          <div className='mx-auto max-w-6xl backdrop-blur-sm'>
            <Transparency />
          </div>
        </div>
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#14F195]/20 to-transparent' />
      </section>

      {/* FAQ */}
      <section className='relative bg-[#13141F] py-24'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/10 via-[#14F195]/5 to-transparent opacity-30' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
        <div className='container relative'>
          <div className='mx-auto max-w-6xl'>
            <FAQ />
          </div>
        </div>
      </section>
    </main>
  )
}
