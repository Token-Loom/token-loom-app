import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get global statistics
    const globalStats = await prisma.globalStatistic.findFirst({
      where: { id: '1' },
      orderBy: { lastUpdated: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalBurned: globalStats?.totalTokensBurned || 0,
        totalTransactions: globalStats?.totalTransactions || 0,
        uniqueTokens: globalStats?.uniqueTokensBurned || 0,
        totalValue: globalStats?.totalFeesCollected || 0
      }
    })
  } catch (error) {
    console.error('Error fetching burn statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch burn statistics' }, { status: 500 })
  }
}
