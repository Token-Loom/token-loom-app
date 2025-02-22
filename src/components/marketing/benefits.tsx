import { Card, CardContent } from '@/components/ui/card'
import { Flame, Clock, Shield, LineChart, Coins, Zap } from 'lucide-react'

const benefits = [
  {
    title: 'Universal Token Support',
    description:
      'Burn any SPL token, including regular tokens and LP tokens from major Solana DEXes like Raydium and Orca.',
    icon: Coins,
    gradient: 'from-[#9945FF]/10 to-transparent'
  },
  {
    title: 'Controlled Burns (Coming Soon)',
    description:
      'Schedule your burns over time with our upcoming controlled burn feature. Perfect for strategic token supply management.',
    icon: Clock,
    gradient: 'from-[#14F195]/10 to-transparent'
  },
  {
    title: 'Maximum Security',
    description: 'Multi-layer security with verifiable burn addresses and real-time transaction monitoring.',
    icon: Shield,
    gradient: 'from-[#00C2FF]/10 to-transparent'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track burn progress, view detailed statistics, and monitor token supply changes in real-time.',
    icon: LineChart,
    gradient: 'from-[#9945FF]/10 to-transparent'
  },
  {
    title: 'Efficient Processing',
    description: 'Optimized burn transactions with minimal fees and maximum efficiency for all token types.',
    icon: Zap,
    gradient: 'from-[#14F195]/10 to-transparent'
  },
  {
    title: 'Complete Control',
    description: 'Full control over your burn strategy with flexible scheduling and detailed reporting.',
    icon: Flame,
    gradient: 'from-[#00C2FF]/10 to-transparent'
  }
]

export function Benefits() {
  return (
    <div className='container mt-[140px] sm:mt-[240px]'>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
          Platform Benefits
        </h2>
        <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
          Advanced features for secure and efficient token burning, supporting both regular and LP tokens.
        </p>
      </div>
      <div className='mx-auto mt-8 sm:mt-16 max-w-5xl'>
        <div className='grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((benefit, index) => (
            <Card key={index} className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient}`} />
              <CardContent className='relative p-4 sm:p-6'>
                <benefit.icon className='mb-3 sm:mb-4 h-6 w-6 sm:h-8 sm:w-8 text-[#E6E6E6]' />
                <h3 className='mb-2 font-display text-lg sm:text-xl font-bold text-[#E6E6E6]'>{benefit.title}</h3>
                <p className='text-sm sm:text-base text-[#E6E6E6]/60'>{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
