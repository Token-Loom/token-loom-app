import { BurnStatistics } from '@/components/marketing/burn-statistics'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Benefits } from '@/components/marketing/benefits'
import { FAQ } from '@/components/marketing/faq'
import { Transparency } from '@/components/marketing/transparency'
import { Banner } from '@/components/marketing/banner'
import { Fees } from '@/components/marketing/fees'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'TokenLoom - The most secure and efficient way to burn Solana tokens. Schedule controlled burns, monitor transactions, and manage your token supply with confidence.',
  openGraph: {
    title: 'TokenLoom - Secure Solana Token Burning',
    description:
      'The most secure and efficient way to burn Solana tokens. Schedule controlled burns, monitor transactions, and manage your token supply with confidence.'
  }
}

export default function Home() {
  return (
    <>
      <Script
        id='structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'TokenLoom',
            description: 'A secure and intuitive token burning service for Solana-based tokens',
            url: 'https://tokenloom.io',
            applicationCategory: 'DeFi',
            operatingSystem: 'Web-based',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            author: {
              '@type': 'Organization',
              name: 'TokenLoom Team',
              url: 'https://tokenloom.io'
            }
          })
        }}
      />
      <main className='min-h-screen bg-[#13141F] relative'>
        {/* Subtle background pattern */}
        <div className='fixed inset-0 bg-[linear-gradient(45deg,_#9945FF05_1px,transparent_1px),linear-gradient(-45deg,_#14F19505_1px,transparent_1px)] bg-[size:48px_48px]' />

        {/* Single subtle gradient */}
        <div className='fixed inset-0 bg-gradient-to-b from-[#9945FF]/5 via-transparent to-[#14F195]/5 pointer-events-none' />

        {/* Content */}
        <div className='relative'>
          <header className='relative z-20'>
            <Banner />
          </header>
          <article className='relative z-10'>
            <div className='space-y-24 sm:space-y-32'>
              <section id='fees'>
                <Fees />
              </section>
              <section id='statistics' aria-label='Burn Statistics'>
                <BurnStatistics />
              </section>
              <section id='how-it-works' aria-label='How It Works'>
                <HowItWorks />
              </section>
              <section id='benefits' aria-label='Benefits'>
                <Benefits />
              </section>
              <section id='transparency' aria-label='Transparency'>
                <Transparency />
              </section>
              <section id='faq' aria-label='Frequently Asked Questions'>
                <FAQ />
              </section>
            </div>
          </article>
        </div>

        {/* Single subtle divider */}
        <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/20 to-transparent' />
      </main>
    </>
  )
}
