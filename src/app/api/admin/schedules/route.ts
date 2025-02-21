import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const schedules = await prisma.scheduledBurn.findMany({
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

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}
