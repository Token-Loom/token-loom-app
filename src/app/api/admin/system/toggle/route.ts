import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CONFIG_ID = '1' // Use the same constant ID as in config/route.ts

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action !== 'pause' && action !== 'resume') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Update system status
    const config = await prisma.systemConfig.upsert({
      where: { id: CONFIG_ID },
      update: {
        isRunning: action === 'resume'
      },
      create: {
        id: CONFIG_ID,
        maxRetries: 3,
        retryDelay: 300,
        maxWorkers: 10,
        isRunning: action === 'resume'
      }
    })

    return NextResponse.json({ isRunning: config.isRunning })
  } catch (error) {
    console.error('Error toggling system:', error)
    return NextResponse.json({ error: 'Failed to toggle system' }, { status: 500 })
  }
}

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

    return NextResponse.json({ isRunning: config.isRunning })
  } catch (error) {
    console.error('Error fetching system status:', error)
    return NextResponse.json({ error: 'Failed to fetch system status' }, { status: 500 })
  }
}
