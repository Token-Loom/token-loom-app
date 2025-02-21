import { Card } from '@/components/ui/card'
import { RocketIcon, LockOpen1Icon, MixIcon, LockClosedIcon } from '@radix-ui/react-icons'

const benefits = [
  {
    title: 'Supply Reduction',
    description: 'Reduce token circulation to potentially increase value through controlled burning.',
    gradient: 'from-[#9945FF] to-[#14F195]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent',
    icon: RocketIcon
  },
  {
    title: 'Transparency',
    description: 'Every burn transaction is verifiable on the Solana blockchain with full tracking.',
    gradient: 'from-[#14F195] to-[#00C2FF]',
    cardGradient: 'from-[#14F195]/5 via-transparent to-transparent',
    icon: LockOpen1Icon
  },
  {
    title: 'Flexibility',
    description: 'Choose between instant burns or controlled burns with customizable schedules.',
    gradient: 'from-[#00C2FF] to-[#9945FF]',
    cardGradient: 'from-[#00C2FF]/5 via-transparent to-transparent',
    icon: MixIcon
  },
  {
    title: 'Security',
    description: 'Industry-leading security protocols protect your tokens throughout the burn process.',
    gradient: 'from-[#9945FF] to-[#00C2FF]',
    cardGradient: 'from-[#9945FF]/5 via-transparent to-transparent',
    icon: LockClosedIcon
  }
]

export function Benefits() {
  return (
    <section className='py-16'>
      <div className='container'>
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
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg shadow-lg relative`}
                  >
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${benefit.gradient}`} />
                    <div className='absolute inset-0 rounded-lg bg-black/40' />
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
    </section>
  )
}
