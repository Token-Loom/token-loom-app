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
    'ControlledBurn - The most secure and efficient way to burn Solana tokens. Schedule controlled burns, monitor transactions, and manage your token supply with confidence.',
  openGraph: {
    title: 'ControlledBurn - Secure Solana Token Burning',
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
            name: 'ControlledBurn',
            description: 'A secure and intuitive token burning service for Solana-based tokens',
            url: 'https://controlledburn.io',
            applicationCategory: 'DeFi',
            operatingSystem: 'Web-based',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            author: {
              '@type': 'Organization',
              name: 'ControlledBurn Team',
              url: 'https://controlledburn.io'
            }
          })
        }}
      />
      <main className='min-h-screen bg-[#13141F]'>
        <header>
          <Banner />
        </header>
        <article>
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
        </article>
      </main>
    </>
  )
}
