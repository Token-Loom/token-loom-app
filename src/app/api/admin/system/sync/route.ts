import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function POST() {
  try {
    // Update statistics
    const [totalBurned, uniqueTokens, totalFees] = await Promise.all([
      prisma.burnTransaction.count({
        where: { status: BurnStatus.CONFIRMED }
      }),
      prisma.burnTransaction
        .groupBy({
          by: ['tokenMint'],
          where: { status: BurnStatus.CONFIRMED }
        })
        .then(groups => groups.length),
      prisma.burnTransaction
        .aggregate({
          where: { status: BurnStatus.CONFIRMED },
          _sum: { feeAmount: true }
        })
        .then(result => result._sum.feeAmount || 0)
    ])

    // Update global statistics
    await prisma.globalStatistic.upsert({
      where: { id: '1' },
      update: {
        totalTokensBurned: totalBurned,
        uniqueTokensBurned: uniqueTokens,
        totalFeesCollected: totalFees,
        lastUpdated: new Date()
      },
      create: {
        id: '1',
        totalTokensBurned: totalBurned,
        uniqueTokensBurned: uniqueTokens,
        totalFeesCollected: totalFees,
        lastUpdated: new Date(),
        instantBurnsCount: 0,
        controlledBurnsCount: 0
      }
    })

    // Update per-token statistics
    const tokenStats = await prisma.burnTransaction.groupBy({
      by: ['tokenMint', 'tokenSymbol'],
      where: { status: BurnStatus.CONFIRMED },
      _sum: {
        amount: true,
        feeAmount: true
      },
      _count: true
    })

    for (const stat of tokenStats) {
      await prisma.burnStatistic.upsert({
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
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing system:', error)
    return NextResponse.json({ error: 'Failed to sync system' }, { status: 500 })
  }
}
