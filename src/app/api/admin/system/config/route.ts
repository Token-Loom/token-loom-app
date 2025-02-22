import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'

const CONFIG_ID = '1' // Use a constant ID for the single config record

export async function GET() {
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

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching system configuration:', error)
    return NextResponse.json({ error: 'Failed to fetch system configuration' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { maxRetries, retryDelay, maxWorkers } = body

    const config = await executeWithRetry(() =>
      prisma.systemConfig.update({
        where: { id: CONFIG_ID },
        data: {
          maxRetries: maxRetries ? parseInt(maxRetries) : undefined,
          retryDelay: retryDelay ? parseInt(retryDelay) : undefined,
          maxWorkers: maxWorkers ? parseInt(maxWorkers) : undefined
        }
      })
    )

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating system configuration:', error)
    return NextResponse.json({ error: 'Failed to update system configuration' }, { status: 500 })
  }
}
