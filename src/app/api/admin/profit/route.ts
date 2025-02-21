import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ExecutionStatus } from '@prisma/client'

export async function GET() {
  try {
    // Get global statistics
    const globalStats = await prisma.globalStatistic.findFirst({
      where: { id: '1' }
    })

    // Get profit breakdown by token
    const tokenProfits = await prisma.burnStatistic.findMany({
      select: {
        tokenSymbol: true,
        totalFeesCollected: true,
        totalTransactions: true,
        instantBurns: true,
        controlledBurns: true
      },
      orderBy: {
        totalFeesCollected: 'desc'
      }
    })

    // Get recent transactions with gas costs
    const recentTransactions = await prisma.burnExecution.findMany({
      where: {
        status: ExecutionStatus.COMPLETED
      },
      select: {
        txSignature: true,
        gasUsed: true,
        completedAt: true,
        transaction: {
          select: {
            tokenSymbol: true,
            feeAmount: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: 10
    })

    // Calculate daily profits for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyProfits = await prisma.burnExecution.groupBy({
      by: ['completedAt'],
      where: {
        status: ExecutionStatus.COMPLETED,
        completedAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        gasUsed: true
      }
    })

    // Format the response
    return NextResponse.json({
      success: true,
      data: {
        totalProfit: {
          feesCollected: globalStats?.totalFeesCollected || 0,
          gasCosts: globalStats?.totalGasCosts || 0,
          netProfit: globalStats?.netProfit || 0
        },
        tokenProfits,
        recentTransactions: recentTransactions.map(tx => ({
          signature: tx.txSignature,
          tokenSymbol: tx.transaction.tokenSymbol,
          feeAmount: tx.transaction.feeAmount,
          gasUsed: tx.gasUsed,
          profit: Number(tx.transaction.feeAmount) - Number(tx.gasUsed || 0),
          completedAt: tx.completedAt
        })),
        dailyProfits: dailyProfits.map(day => ({
          date: day.completedAt,
          gasCosts: day._sum.gasUsed || 0
        }))
      }
    })
  } catch (error) {
    console.error('Error fetching profit information:', error)
    return NextResponse.json({ error: 'Failed to fetch profit information' }, { status: 500 })
  }
}
