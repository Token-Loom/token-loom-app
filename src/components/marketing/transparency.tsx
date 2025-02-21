import { Card } from '@/components/ui/card'
import { GithubIcon, ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    title: 'Open Source',
    description:
      'Our entire codebase is publicly available on GitHub, allowing anyone to inspect, verify, and contribute to the project.',
    icon: GithubIcon,
    link: 'https://github.com/yourusername/controlledburn',
    gradient: 'from-[#9945FF] to-[#14F195]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent'
  },
  {
    title: 'Verifiable Transactions',
    description:
      'Every burn transaction is recorded on the Solana blockchain, providing permanent and transparent proof of token burns.',
    icon: ShieldCheckIcon,
    gradient: 'from-[#14F195] to-[#00C2FF]',
    cardGradient: 'from-[#14F195]/5 via-transparent to-transparent'
  }
]

export function Transparency() {
  return (
    <section className='relative bg-[#1E1E24] py-24'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#14F195]/10 via-[#9945FF]/5 to-transparent opacity-60' />
      <div className='absolute inset-0 bg-[linear-gradient(45deg,_#14F19505_1px,transparent_1px),linear-gradient(-45deg,_#9945FF05_1px,transparent_1px)] bg-[size:32px_32px]' />
      <div className='container relative'>
        <div className='mx-auto max-w-6xl backdrop-blur-sm'>
          <div className='text-center'>
            <h2 className='font-display mb-4 text-3xl font-bold text-[#E6E6E6] sm:text-4xl'>
              Built on{' '}
              <span className='bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent'>
                Transparency
              </span>
            </h2>
            <p className='mx-auto max-w-2xl text-[#A3A3A3]'>
              We believe in complete transparency. Our platform is open source, our transactions are verifiable, and our
              processes are public.
            </p>
          </div>

          <div className='mt-16 grid gap-8 grid-cols-2'>
            {features.map(feature => {
              const Icon = feature.icon
              return (
                <Card
                  key={feature.title}
                  className='group relative overflow-hidden border-0 bg-[#1A1B23] p-6 transition-all duration-500'
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.cardGradient}`} />
                  <div className='absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent' />
                  <div className='relative'>
                    <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg shadow-lg relative'>
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.gradient}`} />
                      <div className='absolute inset-0 rounded-lg bg-black/40' />
                      <Icon className='h-6 w-6 text-white relative z-10' />
                    </div>
                    <h3 className='relative mb-2 text-xl font-semibold text-[#E6E6E6]'>{feature.title}</h3>
                    <p className='relative text-[#A3A3A3]'>{feature.description}</p>
                    {feature.link && (
                      <Link
                        href={feature.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='relative mt-4 inline-flex items-center text-[#14F195] hover:underline'
                      >
                        View on GitHub
                        <span className='ml-1 transition-transform group-hover:translate-x-1'>→</span>
                      </Link>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#14F195]/20 to-transparent' />
    </section>
  )
}
