import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

const CONFIG_ID = '1' // Use the same constant ID as in other system endpoints

// Ensure initial configuration exists
async function ensureConfig() {
  try {
    const config = await executeWithRetry(() =>
      prisma.systemConfig.upsert({
        where: { id: CONFIG_ID },
        update: {},
        create: {
          id: CONFIG_ID,
          maxRetries: 3,
          retryDelay: 300,
          maxWorkers: 10,
          isRunning: true
        }
      })
    )
    return config
  } catch (error) {
    throw error
  }
}

export async function GET() {
  try {
    // Get system configuration
    const config = await ensureConfig()

    // Get active workers count (last 5 minutes)
    const activeWorkers = await executeWithRetry(() =>
      prisma.burnExecution.count({
        where: {
          startedAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000)
          },
          completedAt: null
        }
      })
    )

    // Get pending transactions count
    const pendingTransactions = await executeWithRetry(() =>
      prisma.burnTransaction.count({
        where: {
          status: BurnStatus.PENDING
        }
      })
    )

    // Get failed transactions count (last 24 hours)
    const failedTransactions = await executeWithRetry(() =>
      prisma.burnTransaction.count({
        where: {
          status: BurnStatus.FAILED,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    )

    // Calculate system load (active workers / max workers)
    const systemLoad = activeWorkers / config.maxWorkers

    return NextResponse.json({
      activeWorkers,
      pendingTransactions,
      failedTransactions,
      systemLoad,
      isRunning: config.isRunning,
      lastUpdated: new Date()
    })
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json({ error: 'Failed to fetch system status' }, { status: 500 })
  }
}
