import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { formatNumber } from '@/lib/utils'

export async function GET() {
  try {
    // Get or initialize global statistics
    let globalStats = await executeWithRetry(() =>
      prisma.globalStatistic.findFirst({
        where: { id: '1' }
      })
    )

    // If no global stats exist, create initial record
    if (!globalStats) {
      console.log('Initializing global statistics...')
      globalStats = await executeWithRetry(() =>
        prisma.globalStatistic.create({
          data: {
            id: '1',
            totalTokensBurned: 0,
            totalTransactions: 0,
            uniqueTokensBurned: 0,
            totalFeesCollected: new Decimal(0),
            totalFeesCollectedUSD: new Decimal(0),
            totalGasCosts: new Decimal(0),
            totalGasCostsUSD: new Decimal(0),
            netProfit: new Decimal(0),
            netProfitUSD: new Decimal(0),
            instantBurnsCount: 0,
            controlledBurnsCount: 0,
            lastUpdated: new Date()
          }
        })
      )
    }

    console.log('Global stats:', globalStats)

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

    console.log('Found burn transactions:', burnTransactions.length)

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
    const totalBurned = globalStats.totalFeesCollected || new Decimal(0)

    const responseData = {
      success: true,
      data: {
        totalBurned: totalBurned.toFixed(4), // Format to 4 decimal places
        totalTransactions: globalStats.totalTransactions || 0,
        uniqueTokens: globalStats.uniqueTokensBurned || 0,
        totalValue: formatNumber(Math.round(Number(totalValue))), // Format with commas
        lastUpdated: globalStats.lastUpdated || new Date()
      }
    }

    console.log('Sending response:', responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching burn statistics:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch burn statistics'
      },
      {
        status: 500
      }
    )
  }
}
