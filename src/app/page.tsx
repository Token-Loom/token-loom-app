import { BurnStatistics } from '@/components/marketing/burn-statistics'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Benefits } from '@/components/marketing/benefits'
import { FAQ } from '@/components/marketing/faq'
import { Transparency } from '@/components/marketing/transparency'
import { Banner } from '@/components/marketing/banner'
import { Fees } from '@/components/marketing/fees'

export default function Home() {
  return (
    <main className='min-h-screen bg-[#13141F]'>
      <Banner />
      <Fees />
      <BurnStatistics />
      <HowItWorks />
      <Benefits />
      <Transparency />
      <FAQ />
    </main>
  )
}
