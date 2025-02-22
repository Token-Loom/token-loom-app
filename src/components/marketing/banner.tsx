'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function Banner() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className='relative min-h-[90vh] overflow-hidden py-12 sm:py-24 bg-[#13141F]'>
      <div className='container relative z-10 flex min-h-[calc(90vh-96px)] sm:min-h-[calc(90vh-160px)] flex-col items-center justify-center px-4 sm:px-6'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='mx-auto max-w-4xl text-center'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className='mb-6 inline-block rounded-full bg-gradient-to-r from-[#9945FF]/20 via-[#14F195]/20 to-[#00C2FF]/20 px-6 py-2'
          >
            <span className='bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-sm font-medium text-transparent'>
              The Most Secure Token Burning Platform on Solana
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='font-display mb-6 sm:mb-8 bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-4xl font-bold text-transparent leading-tight sm:text-7xl sm:leading-tight'
          >
            Reduce Supply.
            <br />
            Increase Value.
            <br />
            <span className='text-[#14F195]'>Burn with Confidence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className='mb-8 sm:mb-10 text-lg sm:text-2xl text-[#E6E6E6] px-4 sm:px-0 leading-relaxed'
          >
            The most secure and transparent way to burn Solana tokens.
            <br className='hidden sm:block' />
            Supports both regular tokens and LP tokens with advanced scheduling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
            className='flex flex-col items-center gap-4 sm:flex-row sm:justify-center w-full px-4 sm:px-0'
          >
            <Link href='/burn' className='w-full sm:w-auto'>
              <Button
                size='lg'
                className='w-full sm:w-[200px] h-[48px] sm:h-[56px] bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-bold text-base sm:text-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg shadow-[#9945FF]/20'
              >
                Start Burning
              </Button>
            </Link>
            <Link href='#how-it-works' className='w-full sm:w-auto'>
              <Button
                variant='outline'
                size='lg'
                className='w-full sm:w-[200px] h-[48px] sm:h-[56px] border-[#9945FF] text-[#14F195] font-bold text-base sm:text-lg hover:bg-[#9945FF]/10 transition-all duration-300'
              >
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced background effects */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#9945FF]/20 via-[#14F195]/10 to-transparent animate-pulse' />
      <div className='absolute inset-0 bg-[linear-gradient(45deg,_#9945FF10_1px,transparent_1px),linear-gradient(-45deg,_#14F19510_1px,transparent_1px)] bg-[size:32px_32px]' />
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-[#13141F]/90 to-[#13141F]' />

      {/* Animated border effect */}
      <div className='absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9945FF]/30 to-transparent animate-shimmer' />

      {/* Floating orbs effect */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute w-[300px] h-[300px] rounded-full'
            style={{
              background:
                i === 0
                  ? 'radial-gradient(circle, #9945FF20 0%, transparent 70%)'
                  : i === 1
                    ? 'radial-gradient(circle, #14F19520 0%, transparent 70%)'
                    : 'radial-gradient(circle, #00C2FF20 0%, transparent 70%)',
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </section>
  )
}
