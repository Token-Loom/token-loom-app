'use client'

import { Card } from '@/components/ui/card'
import { GithubIcon, ShieldCheckIcon } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    title: 'Open Source',
    description:
      'Our entire codebase is publicly available on GitHub, allowing anyone to inspect, verify, and contribute to the project.',
    icon: GithubIcon,
    link: 'https://github.com/yourusername/controlledburn',
    color: '#9945FF'
  },
  {
    title: 'Verifiable Transactions',
    description:
      'Every burn transaction is recorded on the Solana blockchain, providing permanent and transparent proof of token burns.',
    icon: ShieldCheckIcon,
    color: '#14F195'
  }
]

export function Transparency() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className='mt-[140px] sm:mt-[240px]'>
      <div className='container relative'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className='mx-auto max-w-4xl'
        >
          <div className='text-center'>
            <h2 className='font-display mb-2 sm:mb-4 text-2xl sm:text-3xl font-bold md:text-4xl'>
              Built on{' '}
              <span className='bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent'>
                Transparency
              </span>
            </h2>
            <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
              We believe in complete transparency. Our platform is open source, our transactions are verifiable, and our
              processes are public.
            </p>
          </div>

          <div className='mt-6 sm:mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <Card className='group relative overflow-hidden border border-white/5 bg-[#1A1B23] p-4 transition-all duration-300 hover:border-white/10 h-full'>
                    <div className='relative flex flex-col h-full'>
                      <div
                        className='mb-3 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg'
                        style={{ backgroundColor: `${feature.color}10` }}
                      >
                        <Icon className='h-4 w-4 sm:h-5 sm:w-5' style={{ color: feature.color }} />
                      </div>
                      <h3 className='mb-1.5 text-base sm:text-lg font-semibold text-[#E6E6E6]'>{feature.title}</h3>
                      <p className='text-sm text-[#A3A3A3] flex-grow'>{feature.description}</p>
                      {feature.link && (
                        <Link
                          href={feature.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='mt-3 inline-flex items-center text-[#14F195] text-sm hover:underline'
                        >
                          View on GitHub
                          <span className='ml-1 transition-transform group-hover:translate-x-1'>→</span>
                        </Link>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
