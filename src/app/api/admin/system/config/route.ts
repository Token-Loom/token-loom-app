import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CONFIG_ID = '1' // Use a constant ID for the single config record

export async function GET() {
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

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching system configuration:', error)
    return NextResponse.json({ error: 'Failed to fetch system configuration' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { maxRetries, retryDelay } = await request.json()

    // Validate input
    if (
      typeof maxRetries !== 'number' ||
      typeof retryDelay !== 'number' ||
      maxRetries < 0 ||
      maxRetries > 10 ||
      retryDelay < 60 ||
      retryDelay > 3600
    ) {
      return NextResponse.json({ error: 'Invalid configuration values' }, { status: 400 })
    }

    // Update configuration
    const config = await prisma.systemConfig.upsert({
      where: { id: CONFIG_ID },
      update: {
        maxRetries,
        retryDelay
      },
      create: {
        id: CONFIG_ID,
        maxRetries,
        retryDelay,
        maxWorkers: 10,
        isRunning: true
      }
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating system configuration:', error)
    return NextResponse.json({ error: 'Failed to update system configuration' }, { status: 500 })
  }
}
