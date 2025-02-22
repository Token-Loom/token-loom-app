import { CheckIcon } from 'lucide-react'

interface FeeOption {
  title: string
  price: string
  priceDetail: string
  features: string[]
  gradient: string
  hoverGradient: string
}

const feeOptions: FeeOption[] = [
  {
    title: 'Immediate Burn',
    price: '0.1 SOL',
    priceDetail: 'per transaction',
    features: ['Instant execution', 'Real-time confirmation', 'Single transaction'],
    gradient: 'from-[#9945FF]/10',
    hoverGradient: 'from-[#9945FF]/20'
  },
  {
    title: 'Controlled Burn',
    price: '0.2 SOL',
    priceDetail: 'one-time fee',
    features: ['Schedule multiple burns', 'Automated execution', 'Unlimited burn schedule'],
    gradient: 'from-[#14F195]/10',
    hoverGradient: 'from-[#14F195]/20'
  }
]

export function Fees() {
  return (
    <section className='relative bg-[#1E1E24] py-28'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-[#14F195]/5 to-transparent' />
      <div className='container relative'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
            Simple, Transparent Pricing
          </h2>
          <p className='text-base sm:text-lg text-[#E6E6E6]/60'>
            Choose between immediate execution or controlled scheduling. One simple fee, no hidden costs.
          </p>
          <div className='grid gap-8 sm:grid-cols-2'>
            {feeOptions.map(option => (
              <div
                key={option.title}
                className='group relative overflow-hidden rounded-2xl border border-[#9945FF]/20 bg-[#13141F]/50 p-8 backdrop-blur-xl transition-all hover:border-[#9945FF]/40'
              >
                <div
                  className={`absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] ${option.gradient} via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className='relative'>
                  <div className='mb-4 inline-block rounded-lg bg-[#9945FF]/10 px-4 py-2'>
                    <h3 className='font-display text-xl font-bold text-[#9945FF]'>{option.title}</h3>
                  </div>
                  <div className='mb-6'>
                    <div className='text-4xl font-bold text-[#E6E6E6]'>{option.price}</div>
                    <p className='text-[#A3A3A3]'>{option.priceDetail}</p>
                  </div>
                  <ul className='space-y-4 text-left text-[#E6E6E6]'>
                    {option.features.map(feature => (
                      <li key={feature} className='flex items-center'>
                        <CheckIcon className='mr-2 h-5 w-5 text-[#14F195]' />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
