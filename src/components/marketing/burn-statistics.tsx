'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { formatNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BurnStats {
  totalBurned: number // Now represents SOL value of burned tokens
  totalTransactions: number
  uniqueTokens: number
  totalValue: number
  lastUpdated: Date
}

export function BurnStatistics() {
  const [stats, setStats] = useState<BurnStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null)
        const response = await fetch('/api/statistics')
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch statistics')
        }

        setStats(result.data)
      } catch (error) {
        console.error('Error fetching burn statistics:', error)
        setError('Failed to load statistics. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className='mt-[140px] sm:mt-[240px]'>
      <div className='container px-4 sm:px-6'>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className='mx-auto max-w-6xl'
        >
          <div className='text-center mb-8 sm:mb-16'>
            <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#E6E6E6] md:text-4xl'>
              Burn Statistics
            </h2>
            <p className='text-base max-w-2xl mx-auto sm:text-lg text-[#E6E6E6]/60'>
              Track the impact of token burning across the Solana ecosystem. Our platform has helped projects
              effectively manage their token supply.
            </p>
          </div>

          {error ? (
            <Alert variant='destructive' className='mb-6'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className='grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'>
              <StatCard
                title='Total Burned (SOL)'
                value={loading ? null : `${formatNumber(stats?.totalBurned || 0)} SOL`}
                color='#9945FF'
                delay={0.1}
                inView={inView}
              />
              <StatCard
                title='Transactions'
                value={loading ? null : formatNumber(stats?.totalTransactions || 0)}
                color='#14F195'
                delay={0.2}
                inView={inView}
              />
              <StatCard
                title='Unique Tokens'
                value={loading ? null : formatNumber(stats?.uniqueTokens || 0)}
                color='#00C2FF'
                delay={0.3}
                inView={inView}
              />
              <StatCard
                title='Total Value'
                value={loading ? null : `$${formatNumber(stats?.totalValue || 0)}`}
                color='#9945FF'
                delay={0.4}
                inView={inView}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function StatCard({
  title,
  value,
  color,
  delay,
  inView
}: {
  title: string
  value: string | null
  color: string
  delay: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className='group relative overflow-hidden border-white/5 bg-[#1A1B23] p-3 sm:p-6 transition-all duration-300 hover:border-white/10'>
        <div className='relative'>
          <h3 className='text-xs sm:text-sm font-medium' style={{ color }}>
            {title}
          </h3>
          <div className='mt-1 sm:mt-2'>
            {value ? (
              <p className='text-lg sm:text-2xl font-semibold text-[#E6E6E6]'>{value}</p>
            ) : (
              <Skeleton className='h-6 sm:h-8 w-16 sm:w-24 bg-[#1E1E24]' />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
