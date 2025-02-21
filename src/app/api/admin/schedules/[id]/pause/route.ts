import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const schedule = await prisma.scheduledBurn.update({
      where: { id },
      data: {
        status: BurnStatus.FAILED,
        errorMessage: 'Cancelled by admin'
      }
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error pausing schedule:', error)
    return NextResponse.json({ error: 'Failed to pause schedule' }, { status: 500 })
  }
}
