import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

const ADMIN_WALLETS = [process.env.ADMIN_WALLET || ''].filter(Boolean)

export async function GET() {
  try {
    // Get all transactions with fees
    const feesData = await executeWithRetry(() =>
      prisma.burnTransaction.findMany({
        select: {
          status: true,
          feeAmount: true,
          tokenSymbol: true,
          burnType: true,
          createdAt: true,
          userWallet: true,
          executions: {
            select: {
              status: true,
              gasUsed: true,
              txSignature: true,
              completedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    )

    // Calculate totals
    let totalFees = 0
    let totalGasCosts = 0
    let pendingFees = 0
    let confirmedFees = 0

    feesData.forEach(tx => {
      const isAdminWallet = tx.userWallet ? ADMIN_WALLETS.includes(tx.userWallet) : false
      const fee = isAdminWallet ? 0 : Number(tx.feeAmount || 0)

      if (tx.status === BurnStatus.CONFIRMED) {
        confirmedFees += fee
        // Set fixed gas cost of 0.00008 SOL per completed transaction
        totalGasCosts += 0.00008
      } else if (tx.status === BurnStatus.PENDING) {
        pendingFees += fee
      }
    })

    totalFees = confirmedFees + pendingFees
    // Net profit is just the confirmed fees - we don't subtract gas costs
    const netProfit = confirmedFees

    // Process token profits
    const tokenProfitMap = new Map()
    feesData.forEach(tx => {
      const isAdminWallet = tx.userWallet ? ADMIN_WALLETS.includes(tx.userWallet) : false
      if (!tokenProfitMap.has(tx.tokenSymbol)) {
        tokenProfitMap.set(tx.tokenSymbol, {
          tokenSymbol: tx.tokenSymbol,
          totalFeesCollected: 0,
          pendingFees: 0,
          totalTransactions: 0,
          pendingTransactions: 0,
          instantBurns: 0,
          controlledBurns: 0
        })
      }
      const profit = tokenProfitMap.get(tx.tokenSymbol)

      if (tx.status === BurnStatus.CONFIRMED) {
        if (!isAdminWallet) {
          profit.totalFeesCollected += Number(tx.feeAmount || 0)
        }
        profit.totalTransactions += 1
      } else if (tx.status === BurnStatus.PENDING) {
        if (!isAdminWallet) {
          profit.pendingFees += Number(tx.feeAmount || 0)
        }
        profit.pendingTransactions += 1
      }

      if (tx.burnType === 'INSTANT') {
        profit.instantBurns += 1
      } else {
        profit.controlledBurns += 1
      }
    })

    const processedTokenProfits = Array.from(tokenProfitMap.values())

    // Calculate daily profits for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyProfits = feesData
      .filter(tx => new Date(tx.createdAt) >= thirtyDaysAgo)
      .reduce<Record<string, { date: string; feesCollected: number; gasCosts: number }>>((acc, tx) => {
        const date = new Date(tx.createdAt).toISOString().split('T')[0]
        const isAdminWallet = tx.userWallet ? ADMIN_WALLETS.includes(tx.userWallet) : false

        if (!acc[date]) {
          acc[date] = {
            date,
            feesCollected: 0,
            gasCosts: 0
          }
        }
        if (tx.status === BurnStatus.CONFIRMED) {
          if (!isAdminWallet) {
            acc[date].feesCollected += Number(tx.feeAmount || 0)
          }
          // Set fixed gas cost of 0.00008 SOL per completed transaction
          acc[date].gasCosts += 0.00008
        }
        return acc
      }, {})

    // Format the response
    return NextResponse.json({
      success: true,
      data: {
        totalProfit: {
          feesCollected: totalFees,
          pendingFees,
          confirmedFees,
          gasCosts: totalGasCosts,
          netProfit: netProfit
        },
        tokenProfits: processedTokenProfits,
        recentTransactions: feesData.slice(0, 10).map(tx => {
          const isAdminWallet = tx.userWallet ? ADMIN_WALLETS.includes(tx.userWallet) : false
          return {
            signature: tx.executions[0]?.txSignature || `pending-${tx.createdAt.getTime()}`,
            tokenSymbol: tx.tokenSymbol,
            feeAmount: isAdminWallet ? 0 : tx.feeAmount,
            status: tx.status,
            gasUsed: '0.00008',
            profit: tx.status === BurnStatus.CONFIRMED ? (isAdminWallet ? 0 : Number(tx.feeAmount)) : null,
            completedAt: tx.executions[0]?.completedAt || tx.createdAt
          }
        }),
        dailyProfits: Object.values(dailyProfits)
      }
    })
  } catch (error) {
    console.error('Error fetching profit information:', error)
    return NextResponse.json({ error: 'Failed to fetch profit information' }, { status: 500 })
  }
}
