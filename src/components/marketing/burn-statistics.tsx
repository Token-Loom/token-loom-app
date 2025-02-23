'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { formatNumber } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BurnStats {
  totalBurned: string // Total fees collected in SOL
  totalTransactions: number
  uniqueTokens: number
  totalValue: string // Total burned value in USD
  lastUpdated: Date
}

interface StatCardProps {
  title: string
  value: string | null
  color: string
  delay: number
  inView: boolean
}

function StatCard({ title, value, color, delay, inView }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className='relative overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
        <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
        <div className='relative p-6'>
          <div className='text-sm font-medium' style={{ color }}>
            {title}
          </div>
          <div className='mt-2 text-2xl font-bold text-[#E6E6E6]'>
            {value === null ? <Skeleton className='h-8 w-24 bg-[#1E1E24]' /> : value}
          </div>
        </div>
      </Card>
    </motion.div>
  )
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
            <h2 className='font-display mb-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
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
                title='Total Fees (SOL)'
                value={loading ? null : `${stats?.totalBurned || '0'} SOL`}
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
                value={loading ? null : `$${stats?.totalValue || '0'}`}
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
