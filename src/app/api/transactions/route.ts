import { NextResponse } from 'next/server'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('wallet')
  const tokenMint = searchParams.get('token')
  const status = searchParams.get('status') as BurnStatus | undefined
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    const where = {
      ...(walletAddress && { userWallet: walletAddress }),
      ...(tokenMint && { tokenMint }),
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
    }

    const [transactions, total] = await Promise.all([
      executeWithRetry(() =>
        prisma.burnTransaction.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        })
      ),
      executeWithRetry(() => prisma.burnTransaction.count({ where }))
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
