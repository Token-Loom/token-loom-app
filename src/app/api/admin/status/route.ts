import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

const CONFIG_ID = '1' // Use the same constant ID as in other system endpoints

export async function GET() {
  try {
    const [pendingTransactions, failedTransactions, activeWorkers, config] = await Promise.all([
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
      }),
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
    ])

    // Calculate system load based on active workers and configured max workers
    const systemLoad = activeWorkers / config.maxWorkers

    return NextResponse.json({
      activeWorkers,
      pendingTransactions,
      failedTransactions,
      systemLoad,
      lastUpdated: new Date()
    })
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json({ error: 'Failed to fetch system status' }, { status: 500 })
  }
}
