import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Maximum number of retries for database operations
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

async function executeWithRetry<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    // Check if it's a connection or prepared statement error
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      (error instanceof Error && error.message.includes('prepared statement'))
    ) {
      if (retryCount < MAX_RETRIES) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))

        // Disconnect and reconnect to clear the connection pool
        await prisma.$disconnect()
        await prisma.$connect()

        // Retry the operation
        return executeWithRetry(operation, retryCount + 1)
      }
    }
    throw error
  }
}

export async function GET() {
  try {
    // Execute the query with retry logic
    const schedules = await executeWithRetry(() =>
      prisma.scheduledBurn.findMany({
        orderBy: [{ scheduledFor: 'asc' }],
        include: {
          transaction: {
            select: {
              tokenSymbol: true,
              tokenMint: true
            }
          }
        },
        take: 100 // Limit to 100 most recent schedules
      })
    )

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      error: 'Failed to fetch schedules',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(errorDetails, { status: 500 })
  } finally {
    // Ensure we disconnect properly
    await prisma.$disconnect()
  }
}
