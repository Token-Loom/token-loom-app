import { Card } from '@/components/ui/card'
import { ShieldCheckIcon, LockIcon, ClockIcon, LineChartIcon } from 'lucide-react'

const benefits = [
  {
    title: 'Secure & Audited',
    description: 'Our platform is built with security-first principles and has undergone thorough audits.',
    icon: ShieldCheckIcon,
    gradient: 'from-[#9945FF] to-[#14F195]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent'
  },
  {
    title: 'Permissionless',
    description: 'No registration required. Connect your wallet and start burning tokens immediately.',
    icon: LockIcon,
    gradient: 'from-[#14F195] to-[#00C2FF]',
    cardGradient: 'from-[#14F195]/5 via-transparent to-transparent'
  },
  {
    title: 'Scheduled Burns',
    description: 'Set up automated burns with our advanced scheduling system.',
    icon: ClockIcon,
    gradient: 'from-[#00C2FF] to-[#9945FF]',
    cardGradient: 'from-[#00C2FF]/5 via-transparent to-transparent'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track your burns and monitor token metrics with our detailed analytics.',
    icon: LineChartIcon,
    gradient: 'from-[#9945FF] to-[#14F195]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent'
  }
]

export function Benefits() {
  return (
    <section className='relative bg-[#13141F] py-24'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
      <div className='container relative'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center'>
            <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>Why Choose Our Platform</h2>
            <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
              Our platform offers the most secure and flexible token burning solution on Solana, with features designed
              for both individuals and projects.
            </p>
          </div>

          <div className='mt-16 grid gap-8 sm:grid-cols-2'>
            {benefits.map(benefit => {
              const Icon = benefit.icon
              return (
                <Card
                  key={benefit.title}
                  className='group relative overflow-hidden border-0 bg-[#1A1B23] p-6 transition-all duration-500'
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.cardGradient}`} />
                  <div className='absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent' />
                  <div className='relative'>
                    <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg shadow-lg relative'>
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${benefit.gradient} opacity-90`} />
                      <div className='absolute inset-0 rounded-lg bg-black/30' />
                      <Icon className='h-6 w-6 text-white relative z-10' />
                    </div>
                    <h3 className='mb-2 text-xl font-semibold text-[#E6E6E6]'>{benefit.title}</h3>
                    <p className='text-[#A3A3A3]'>{benefit.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
