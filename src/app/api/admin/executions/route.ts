import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const executions = await prisma.burnExecution.findMany({
      orderBy: [{ startedAt: 'desc' }],
      take: 50, // Limit to 50 most recent executions
      include: {
        transaction: {
          select: {
            tokenSymbol: true,
            tokenMint: true,
            amount: true
          }
        }
      }
    })

    return NextResponse.json(executions)
  } catch (error) {
    console.error('Error fetching executions:', error)
    return NextResponse.json({ error: 'Failed to fetch executions' }, { status: 500 })
  }
}
