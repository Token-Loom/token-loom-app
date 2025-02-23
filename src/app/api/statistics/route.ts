import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { formatNumber } from '@/lib/utils'

export async function GET() {
  try {
    // Get global statistics
    const globalStats = await executeWithRetry(() =>
      prisma.globalStatistic.findFirst({
        where: { id: '1' }
      })
    )

    // Get total burned USD value from burn transactions
    const burnTransactions = await executeWithRetry(() =>
      prisma.burnTransaction.findMany({
        where: {
          status: 'CONFIRMED'
        },
        select: {
          amount: true,
          tokenPriceUSD: true,
          tokenDecimals: true
        }
      })
    )

    // Calculate total value by summing up each transaction's amount * price
    const totalValue = burnTransactions.reduce((sum, tx) => {
      const amount = tx.amount || new Decimal(0)
      const price = tx.tokenPriceUSD || new Decimal(0)

      // Calculate value in USD - directly multiply amount by price
      // No need to adjust for decimals since price is already per token unit
      const valueUSD = amount.mul(price)

      return sum.add(valueUSD)
    }, new Decimal(0))

    // Format decimal values
    const totalBurned = globalStats?.totalFeesCollected || new Decimal(0)

    return NextResponse.json({
      success: true,
      data: {
        totalBurned: totalBurned.toFixed(4), // Format to 4 decimal places
        totalTransactions: globalStats?.totalTransactions || 0,
        uniqueTokens: globalStats?.uniqueTokensBurned || 0,
        totalValue: formatNumber(Math.round(Number(totalValue))), // Format with commas
        lastUpdated: globalStats?.lastUpdated || new Date()
      }
    })
  } catch (error) {
    console.error('Error fetching burn statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch burn statistics' }, { status: 500 })
  }
}
