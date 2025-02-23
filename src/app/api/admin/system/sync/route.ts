import { NextResponse } from 'next/server'
import { executeWithRetry } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { TokenType } from '@prisma/client'

function convertToUSD(amount: Decimal | null, priceUSD: Decimal, decimals: number): Decimal {
  if (!amount) return new Decimal(0)

  // Convert token amount to base units
  const baseAmount = amount.div(new Decimal(10).pow(decimals))

  // Convert to USD
  return baseAmount.mul(priceUSD)
}

export async function POST() {
  try {
    console.log('Starting system sync...')

    const result = await executeWithRetry(async client => {
      return await client.$transaction(async tx => {
        // Get all confirmed burn transactions
        const burnTransactions = await tx.burnTransaction.findMany({
          where: {
            status: 'CONFIRMED'
          },
          select: {
            tokenMint: true,
            tokenSymbol: true,
            tokenType: true,
            amount: true,
            feeAmount: true,
            tokenPriceUSD: true,
            tokenDecimals: true,
            burnType: true
          }
        })

        // Group transactions by token
        const tokenGroups = burnTransactions.reduce(
          (acc, tx) => {
            const key = tx.tokenMint
            if (!acc[key]) {
              acc[key] = {
                tokenMint: tx.tokenMint,
                tokenSymbol: tx.tokenSymbol || '',
                tokenType: tx.tokenType,
                totalAmount: new Decimal(0),
                totalBurnedUSD: new Decimal(0),
                totalFees: new Decimal(0),
                totalTransactions: 0,
                instantBurns: 0,
                controlledBurns: 0
              }
            }

            // Add amounts
            acc[key].totalAmount = acc[key].totalAmount.add(tx.amount)
            acc[key].totalBurnedUSD = acc[key].totalBurnedUSD.add(
              convertToUSD(tx.amount, new Decimal(tx.tokenPriceUSD), tx.tokenDecimals)
            )
            acc[key].totalFees = acc[key].totalFees.add(tx.feeAmount)
            acc[key].totalTransactions++

            // Count burn types
            if (tx.burnType === 'INSTANT') {
              acc[key].instantBurns++
            } else if (tx.burnType === 'CONTROLLED') {
              acc[key].controlledBurns++
            }

            return acc
          },
          {} as Record<
            string,
            {
              tokenMint: string
              tokenSymbol: string
              tokenType: TokenType
              totalAmount: Decimal
              totalBurnedUSD: Decimal
              totalFees: Decimal
              totalTransactions: number
              instantBurns: number
              controlledBurns: number
            }
          >
        )

        // Calculate totals
        let totalBurnedUSD = new Decimal(0)
        let totalTransactions = 0
        let totalFees = new Decimal(0)
        let instantBurns = 0
        let controlledBurns = 0
        const uniqueTokens = Object.keys(tokenGroups).length

        // Update per-token statistics
        for (const stats of Object.values(tokenGroups)) {
          // Update burn statistics
          await tx.burnStatistic.upsert({
            where: { tokenMint: stats.tokenMint },
            create: {
              tokenMint: stats.tokenMint,
              tokenSymbol: stats.tokenSymbol,
              tokenType: stats.tokenType,
              totalBurned: stats.totalAmount,
              totalBurnedUSD: stats.totalBurnedUSD,
              totalFeesCollected: stats.totalFees,
              totalFeesCollectedUSD: convertToUSD(stats.totalFees, new Decimal(100), 9), // SOL price and decimals
              totalTransactions: stats.totalTransactions,
              instantBurns: stats.instantBurns,
              controlledBurns: stats.controlledBurns,
              lastUpdated: new Date()
            },
            update: {
              totalBurned: stats.totalAmount,
              totalBurnedUSD: stats.totalBurnedUSD,
              totalFeesCollected: stats.totalFees,
              totalFeesCollectedUSD: convertToUSD(stats.totalFees, new Decimal(100), 9), // SOL price and decimals
              totalTransactions: stats.totalTransactions,
              instantBurns: stats.instantBurns,
              controlledBurns: stats.controlledBurns,
              lastUpdated: new Date()
            }
          })

          // Accumulate global totals
          totalBurnedUSD = totalBurnedUSD.add(stats.totalBurnedUSD)
          totalTransactions += stats.totalTransactions
          totalFees = totalFees.add(stats.totalFees)
          instantBurns += stats.instantBurns
          controlledBurns += stats.controlledBurns
        }

        // Get gas costs
        const gasCosts = await tx.burnExecution.aggregate({
          where: {
            status: 'COMPLETED',
            gasUsed: {
              not: null
            }
          },
          _sum: {
            gasUsed: true
          }
        })

        const totalGasCosts = gasCosts._sum.gasUsed || new Decimal(0)
        const totalFeesUSD = convertToUSD(totalFees, new Decimal(100), 9) // SOL price and decimals
        const totalGasCostsUSD = convertToUSD(totalGasCosts, new Decimal(100), 9) // SOL price and decimals

        console.log('Calculated totals:', {
          totalTransactions,
          uniqueTokens,
          instantBurns,
          controlledBurns,
          totalBurnedUSD: totalBurnedUSD.toString(),
          totalFees: totalFees.toString(),
          totalFeesUSD: totalFeesUSD.toString(),
          totalGasCosts: totalGasCosts.toString(),
          totalGasCostsUSD: totalGasCostsUSD.toString()
        })

        // Update global statistics
        await tx.globalStatistic.upsert({
          where: { id: '1' },
          create: {
            id: '1',
            totalTokensBurned: totalTransactions,
            totalTransactions,
            uniqueTokensBurned: uniqueTokens,
            totalFeesCollected: totalFees,
            totalFeesCollectedUSD: totalFeesUSD,
            totalGasCosts,
            totalGasCostsUSD,
            netProfit: totalFees.sub(totalGasCosts),
            netProfitUSD: totalFeesUSD.sub(totalGasCostsUSD),
            instantBurnsCount: instantBurns,
            controlledBurnsCount: controlledBurns,
            lastUpdated: new Date()
          },
          update: {
            totalTokensBurned: totalTransactions,
            totalTransactions,
            uniqueTokensBurned: uniqueTokens,
            totalFeesCollected: totalFees,
            totalFeesCollectedUSD: totalFeesUSD,
            totalGasCosts,
            totalGasCostsUSD,
            netProfit: totalFees.sub(totalGasCosts),
            netProfitUSD: totalFeesUSD.sub(totalGasCostsUSD),
            instantBurnsCount: instantBurns,
            controlledBurnsCount: controlledBurns,
            lastUpdated: new Date()
          }
        })

        return {
          totalTransactions,
          uniqueTokens,
          totalBurnedUSD: totalBurnedUSD.toString(),
          totalFees: totalFees.toString(),
          totalFeesUSD: totalFeesUSD.toString(),
          totalGasCosts: totalGasCosts.toString(),
          totalGasCostsUSD: totalGasCostsUSD.toString(),
          netProfit: totalFees.sub(totalGasCosts).toString(),
          netProfitUSD: totalFeesUSD.sub(totalGasCostsUSD).toString()
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error syncing system:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sync system'
      },
      { status: 500 }
    )
  }
}
