import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'

export async function GET() {
  try {
    // Get global statistics
    const globalStats = await executeWithRetry(() =>
      prisma.globalStatistic.findFirst({
        where: { id: '1' },
        orderBy: { lastUpdated: 'desc' }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        totalBurned: globalStats?.totalTokensBurned || 0,
        totalTransactions: globalStats?.totalTransactions || 0,
        uniqueTokens: globalStats?.uniqueTokensBurned || 0,
        totalFeesCollected: globalStats?.totalFeesCollected || 0,
        totalGasCosts: globalStats?.totalGasCosts || 0,
        netProfit: globalStats?.netProfit || 0,
        lastUpdated: globalStats?.lastUpdated || new Date()
      }
    })
  } catch (error) {
    console.error('Error fetching burn statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch burn statistics' }, { status: 500 })
  }
}
