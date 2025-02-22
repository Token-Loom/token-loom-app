'use client'

import { CheckIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface FeeOption {
  title: string
  price: string
  priceDetail: string
  features: string[]
  color: string
}

const feeOptions: FeeOption[] = [
  {
    title: 'Immediate Burn',
    price: '0.1 SOL',
    priceDetail: 'per transaction',
    features: ['Instant execution', 'Real-time confirmation', 'Single transaction'],
    color: '#9945FF'
  },
  {
    title: 'Controlled Burn',
    price: 'Coming Soon',
    priceDetail: 'Stay tuned!',
    features: ['Schedule multiple burns', 'Automated execution', 'Unlimited burn schedule'],
    color: '#14F195'
  }
]

export function Fees() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className='mt-[140px] sm:mt-[220px]'>
      <div className='container relative'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className='mx-auto max-w-4xl text-center'
        >
          <h2 className='font-display mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
            Simple, Transparent Pricing
          </h2>
          <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
            Choose between immediate execution or controlled scheduling. One simple fee, no hidden costs.
          </p>
          <div className='grid mt-12 gap-8 sm:grid-cols-2'>
            {feeOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              >
                <div className='group relative overflow-hidden rounded-2xl border border-white/5 bg-[#1A1B23] p-8 transition-all duration-300 hover:border-white/10'>
                  <div className='relative'>
                    <div
                      className='mb-4 inline-block rounded-lg px-4 py-2'
                      style={{ backgroundColor: `${option.color}10` }}
                    >
                      <h3 className='font-display text-xl font-bold' style={{ color: option.color }}>
                        {option.title}
                      </h3>
                    </div>
                    <div className='mb-6'>
                      <div className='text-4xl font-bold text-[#E6E6E6]'>{option.price}</div>
                      <p className='text-[#A3A3A3]'>{option.priceDetail}</p>
                    </div>
                    <ul className='space-y-4 text-left text-[#E6E6E6]'>
                      {option.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + index * 0.1 + featureIndex * 0.1, duration: 0.3 }}
                          className='flex items-center'
                        >
                          <div className='mr-2 rounded-full p-1' style={{ backgroundColor: `${option.color}10` }}>
                            <CheckIcon className='h-4 w-4' style={{ color: option.color }} />
                          </div>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
