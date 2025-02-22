'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import { formatNumber } from '@/lib/utils'

interface BurnStats {
  totalBurned: number
  totalTransactions: number
  uniqueTokens: number
  totalValue: number
}

export function BurnStatistics() {
  const [stats, setStats] = useState<BurnStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics')
        const { data } = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching burn statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className='relative bg-[#13141F] py-12 sm:py-24'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
      <div className='container relative px-4 sm:px-6'>
        <div className='mx-auto max-w-6xl'>
          <div className='text-center mb-8 sm:mb-16'>
            <h2 className='font-display mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-[#E6E6E6] md:text-4xl'>
              Real-Time Burn Statistics
            </h2>
            <p className='mx-auto max-w-2xl text-sm sm:text-base text-[#A3A3A3]'>
              Track the impact of token burning across the Solana ecosystem. Our platform has helped projects
              effectively manage their token supply.
            </p>
          </div>

          <div className='grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              title='Total Burned'
              value={loading ? null : `${formatNumber(stats?.totalBurned || 0)} SOL`}
              cardGradient='from-[#9945FF]/5 via-transparent to-transparent'
            />
            <StatCard
              title='Transactions'
              value={loading ? null : formatNumber(stats?.totalTransactions || 0)}
              cardGradient='from-[#14F195]/5 via-transparent to-transparent'
            />
            <StatCard
              title='Unique Tokens'
              value={loading ? null : formatNumber(stats?.uniqueTokens || 0)}
              cardGradient='from-[#00C2FF]/5 via-transparent to-transparent'
            />
            <StatCard
              title='Total Value'
              value={loading ? null : `$${formatNumber(stats?.totalValue || 0)}`}
              cardGradient='from-[#9945FF]/5 via-transparent to-transparent'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ title, value, cardGradient }: { title: string; value: string | null; cardGradient: string }) {
  return (
    <Card className='group relative overflow-hidden border-0 bg-[#1A1B23] p-3 sm:p-6 transition-all duration-500'>
      <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient}`} />
      <div className='absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent' />
      <div className='relative'>
        <h3 className='text-xs sm:text-sm font-medium text-[#A3A3A3]'>{title}</h3>
        <div className='mt-1 sm:mt-2'>
          {value ? (
            <p className='text-lg sm:text-2xl font-semibold text-[#E6E6E6]'>{value}</p>
          ) : (
            <Skeleton className='h-6 sm:h-8 w-16 sm:w-24 bg-[#1E1E24]' />
          )}
        </div>
      </div>
    </Card>
  )
}
