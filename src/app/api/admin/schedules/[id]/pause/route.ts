import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const schedule = await prisma.scheduledBurn.update({
      where: { id: params.id },
      data: {
        status: BurnStatus.CANCELLED
      }
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error pausing schedule:', error)
    return NextResponse.json({ error: 'Failed to pause schedule' }, { status: 500 })
  }
}
