import { Card } from '@/components/ui/card'
import { GitHubLogoIcon, LockOpen1Icon, CheckCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

const IconComponent = {
  github: GitHubLogoIcon,
  shield: CheckCircledIcon,
  lock: LockOpen1Icon
}

const features = [
  {
    title: 'Open Source',
    description:
      'Our entire codebase is publicly available on GitHub, allowing anyone to inspect, verify, and contribute to the project.',
    iconType: 'github' as const,
    link: 'https://github.com/yourusername/controlledburn',
    gradient: 'from-[#9945FF] to-[#14F195]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent'
  },
  {
    title: 'Verifiable Transactions',
    description:
      'Every burn transaction is recorded on the Solana blockchain, providing permanent and transparent proof of token burns.',
    iconType: 'shield' as const,
    gradient: 'from-[#14F195] to-[#00C2FF]',
    cardGradient: 'from-[#14F195]/5 via-transparent to-transparent'
  },
  {
    title: 'Public API',
    description: 'Access our public API to integrate burn statistics and verification into your own applications.',
    iconType: 'lock' as const,
    gradient: 'from-[#00C2FF] to-[#9945FF]',
    cardGradient: 'from-[#00C2FF]/5 via-transparent to-transparent'
  }
]

export function Transparency() {
  return (
    <section className='py-16'>
      <div className='container'>
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

        <div className='mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map(feature => {
            const Icon = IconComponent[feature.iconType]
            return (
              <Card
                key={feature.title}
                className='group relative overflow-hidden border-0 bg-[#1A1B23] p-6 transition-all duration-500'
              >
                <div className='absolute inset-0 bg-gradient-to-br ${feature.cardGradient}' />
                <div className='absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent' />
                <div className='relative'>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg shadow-lg relative`}
                  >
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.gradient}`} />
                    <div className='absolute inset-0 rounded-lg bg-black/40' />
                    <Icon className='h-6 w-6 text-white relative z-10' />
                  </div>
                  <h3 className='relative mb-2 text-xl font-semibold text-[#E6E6E6]'>{feature.title}</h3>
                  <p className='relative text-[#A3A3A3]'>{feature.description}</p>
                </div>
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
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
