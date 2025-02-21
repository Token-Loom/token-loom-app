import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CONFIG_ID = '1'

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

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action !== 'pause' && action !== 'resume') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    // Update system status
    const config = await prisma.systemConfig.update({
      where: { id: CONFIG_ID },
      data: {
        isRunning: action === 'resume'
      }
    })

    return NextResponse.json({ isRunning: config.isRunning })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to toggle system',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
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
