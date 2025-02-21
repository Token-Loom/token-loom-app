import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

const CONFIG_ID = '1' // Use the same constant ID as in other system endpoints

// Ensure initial configuration exists
async function ensureConfig() {
  try {
    const config = await prisma.systemConfig.upsert({
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
    return config
  } catch (error) {
    throw error
  }
}

export async function GET() {
  try {
    // First ensure config exists
    const config = await ensureConfig()

    // Then fetch other metrics
    const [pendingTransactions, failedTransactions, activeWorkers] = await Promise.all([
      prisma.burnTransaction.count({
        where: { status: BurnStatus.PENDING }
      }),
      prisma.burnTransaction.count({
        where: { status: BurnStatus.FAILED }
      }),
      prisma.burnExecution.count({
        where: {
          startedAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          },
          completedAt: null
        }
      })
    ])

    // Calculate system load based on active workers and configured max workers
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
    return NextResponse.json(
      {
        error: 'Failed to fetch system status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
