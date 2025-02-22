import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function GET() {
  try {
    // Get confirmed transactions count
    const totalTransactions = await executeWithRetry(() =>
      prisma.burnTransaction.count({
        where: { status: BurnStatus.CONFIRMED }
      })
    )

    // Get unique tokens count
    const uniqueTokens = await executeWithRetry(() =>
      prisma.burnTransaction
        .groupBy({
          by: ['tokenMint'],
          where: { status: BurnStatus.CONFIRMED }
        })
        .then(groups => groups.length)
    )

    // Calculate total burned in SOL value
    // For now this will be 0 since the tokens (FLOF) have no value
    // In production, you would fetch the token's SOL price from an oracle or price feed
    const totalBurnedInSol = 0

    return NextResponse.json({
      success: true,
      data: {
        totalBurned: totalBurnedInSol,
        totalTransactions,
        uniqueTokens,
        totalValue: 0, // Burned tokens have no value
        lastUpdated: new Date()
      }
    })
  } catch (error) {
    console.error('Error fetching burn statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch burn statistics' }, { status: 500 })
  }
}
