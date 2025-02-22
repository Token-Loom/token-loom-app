import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function POST() {
  try {
    // Update statistics
    const [totalBurned, uniqueTokens, totalFees, totalGasCosts] = await Promise.all([
      executeWithRetry(() =>
        prisma.burnTransaction.count({
          where: { status: BurnStatus.CONFIRMED }
        })
      ),
      executeWithRetry(() =>
        prisma.burnTransaction
          .groupBy({
            by: ['tokenMint'],
            where: { status: BurnStatus.CONFIRMED }
          })
          .then(groups => groups.length)
      ),
      executeWithRetry(() =>
        prisma.burnTransaction
          .aggregate({
            where: { status: BurnStatus.CONFIRMED },
            _sum: { feeAmount: true }
          })
          .then(result => result._sum.feeAmount || 0)
      ),
      executeWithRetry(() =>
        prisma.burnExecution
          .aggregate({
            where: { status: 'COMPLETED' },
            _sum: { gasUsed: true }
          })
          .then(result => result._sum.gasUsed || 0)
      )
    ])

    // Calculate net profit
    const netProfit = Number(totalFees) - Number(totalGasCosts)

    // Update global statistics
    await executeWithRetry(() =>
      prisma.globalStatistic.upsert({
        where: { id: '1' },
        update: {
          totalTokensBurned: totalBurned,
          uniqueTokensBurned: uniqueTokens,
          totalFeesCollected: totalFees,
          totalGasCosts: totalGasCosts,
          netProfit: netProfit,
          lastUpdated: new Date()
        },
        create: {
          id: '1',
          totalTokensBurned: totalBurned,
          uniqueTokensBurned: uniqueTokens,
          totalFeesCollected: totalFees,
          totalGasCosts: totalGasCosts,
          netProfit: netProfit,
          lastUpdated: new Date(),
          instantBurnsCount: 0,
          controlledBurnsCount: 0
        }
      })
    )

    // Update per-token statistics
    const tokenStats = await executeWithRetry(() =>
      prisma.burnTransaction.groupBy({
        by: ['tokenMint', 'tokenSymbol'],
        where: { status: BurnStatus.CONFIRMED },
        _sum: {
          amount: true,
          feeAmount: true
        },
        _count: true
      })
    )

    for (const stat of tokenStats) {
      await executeWithRetry(() =>
        prisma.burnStatistic.upsert({
          where: { tokenMint: stat.tokenMint },
          update: {
            totalBurned: stat._sum.amount || 0,
            totalFeesCollected: stat._sum.feeAmount || 0,
            totalTransactions: stat._count,
            lastUpdated: new Date()
          },
          create: {
            tokenMint: stat.tokenMint,
            tokenSymbol: stat.tokenSymbol,
            totalBurned: stat._sum.amount || 0,
            totalFeesCollected: stat._sum.feeAmount || 0,
            totalTransactions: stat._count,
            lastUpdated: new Date(),
            instantBurns: 0,
            controlledBurns: 0
          }
        })
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing system:', error)
    return NextResponse.json({ error: 'Failed to sync system' }, { status: 500 })
  }
}
