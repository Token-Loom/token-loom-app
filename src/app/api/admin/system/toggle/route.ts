import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'

const CONFIG_ID = '1'

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

export async function POST() {
  try {
    // Get current config
    const currentConfig = await ensureConfig()

    // Toggle system status
    const updatedConfig = await executeWithRetry(() =>
      prisma.systemConfig.update({
        where: { id: CONFIG_ID },
        data: {
          isRunning: !currentConfig.isRunning
        }
      })
    )

    return NextResponse.json({
      success: true,
      isRunning: updatedConfig.isRunning
    })
  } catch (error) {
    console.error('Error toggling system status:', error)
    return NextResponse.json({ error: 'Failed to toggle system status' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const config = await ensureConfig()

    return NextResponse.json({ isRunning: config.isRunning })
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
