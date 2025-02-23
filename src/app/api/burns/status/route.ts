import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BurnStatus } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')
    const walletAddress = searchParams.get('walletAddress')
    const status = searchParams.get('status') as BurnStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build the where clause based on parameters
    const where = {
      ...(transactionId && { id: transactionId }),
      ...(walletAddress && { userWallet: walletAddress }),
      ...(status && { status })
    }

    // Get transactions with related data
    const transactions = await prisma.burnTransaction.findMany({
      where,
      include: {
        scheduledBurn: {
          include: {
            executions: true
          }
        },
        executions: true,
        notifications: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.burnTransaction.count({ where })

    // Format the response
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      tokenMint: tx.tokenMint,
      tokenSymbol: tx.tokenSymbol,
      amount: tx.amount.toString(),
      status: tx.status,
      burnType: tx.burnType,
      createdAt: tx.createdAt,
      confirmedAt: tx.confirmedAt,
      txSignature: tx.txSignature,
      scheduledBurn: tx.scheduledBurn
        ? {
            id: tx.scheduledBurn.id,
            scheduledFor: tx.scheduledBurn.scheduledFor,
            status: tx.scheduledBurn.status,
            executedAt: tx.scheduledBurn.executedAt,
            error: tx.scheduledBurn.error,
            executions: tx.scheduledBurn.executions.map(exec => ({
              id: exec.id,
              status: exec.status,
              txSignature: exec.txSignature,
              startedAt: exec.startedAt,
              completedAt: exec.completedAt,
              errorMessage: exec.errorMessage
            }))
          }
        : null,
      executions: tx.executions.map(exec => ({
        id: exec.id,
        status: exec.status,
        txSignature: exec.txSignature,
        startedAt: exec.startedAt,
        completedAt: exec.completedAt,
        errorMessage: exec.errorMessage
      })),
      latestNotification: tx.notifications[0]
        ? {
            type: tx.notifications[0].type,
            message: tx.notifications[0].message,
            createdAt: tx.notifications[0].createdAt
          }
        : null
    }))

    return NextResponse.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching burn status:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch burn status' }, { status: 500 })
  }
}
