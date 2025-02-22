import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BurnType, BurnStatus, TokenType, Prisma, ExecutionStatus } from '@prisma/client'
import { generateBurnWallet } from '@/lib/solana/wallet'
import { Connection, clusterApiUrl } from '@solana/web3.js'

// Maximum number of retries for database operations
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Initialize Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'))

// Admin wallets bypass platform fees
const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET || ''
const ADMIN_WALLETS = (process.env.NEXT_PUBLIC_ADMIN_WALLETS || '').split(',').filter(Boolean)
const ALL_ADMIN_WALLETS = [PAYMENT_WALLET, ...ADMIN_WALLETS].filter(Boolean)

// Validate scheduled burn
const scheduledBurnSchema = z.object({
  scheduledFor: z.string().datetime(),
  amount: z.string()
})

// Validate the request body
const burnRequestSchema = z.object({
  tokenMint: z.string(),
  tokenName: z.string(),
  tokenSymbol: z.string(),
  tokenType: z.enum(['REGULAR', 'LP']).default('REGULAR'),
  amount: z.string(),
  burnType: z.enum(['INSTANT', 'CONTROLLED']),
  message: z.string().optional(),
  userWallet: z.string(),
  signature: z.string(),
  scheduledBurns: z.array(scheduledBurnSchema).optional(),
  // LP token fields
  lpToken0Mint: z.string().optional(),
  lpToken1Mint: z.string().optional(),
  lpToken0Symbol: z.string().optional(),
  lpToken1Symbol: z.string().optional(),
  lpPoolAddress: z.string().optional()
})

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('Invalid or missing ENCRYPTION_KEY environment variable')
}

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
        console.log(`Retrying operation (attempt ${retryCount + 1}/${MAX_RETRIES})...`)
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = burnRequestSchema.parse(body)

    // Check if admin wallet
    const isAdminWallet = ALL_ADMIN_WALLETS.includes(data.userWallet)

    // Calculate fee based on burn type and wallet type
    const standardFee = data.burnType === 'INSTANT' ? 0.1 : 0.2
    const feeAmount = isAdminWallet ? 0.00008 : standardFee // Admin wallets only pay gas costs

    // Generate new burn wallet with encryption
    const { walletAddress, encryptedPrivateKey } = await generateBurnWallet(ENCRYPTION_KEY as string)

    // Create burn wallet with retry mechanism
    const burnWallet = await executeWithRetry(() =>
      prisma.burnWallet.create({
        data: {
          walletAddress,
          privateKey: encryptedPrivateKey,
          isActive: true
        }
      })
    )

    // Ensure user exists in the database with retry mechanism
    await executeWithRetry(() =>
      prisma.user.upsert({
        where: { walletAddress: data.userWallet },
        update: {},
        create: {
          walletAddress: data.userWallet,
          notifyOnStart: true,
          notifyOnComplete: true,
          notifyOnFailure: true
        }
      })
    )

    // Create the burn transaction with retry mechanism
    const transaction = await executeWithRetry(() =>
      prisma.burnTransaction.create({
        data: {
          tokenMint: data.tokenMint,
          tokenName: data.tokenName,
          tokenSymbol: data.tokenSymbol,
          tokenType: data.tokenType as TokenType,
          amount: data.amount,
          burnType: data.burnType as BurnType,
          feeAmount: feeAmount.toString(),
          burnMessage: data.message,
          status: BurnStatus.PENDING,
          userWallet: data.userWallet,
          burnWalletId: burnWallet.id,
          txSignature: data.signature,
          // LP token fields
          ...(data.tokenType === 'LP'
            ? {
                lpToken0Mint: data.lpToken0Mint,
                lpToken1Mint: data.lpToken1Mint,
                lpToken0Symbol: data.lpToken0Symbol,
                lpToken1Symbol: data.lpToken1Symbol,
                lpPoolAddress: data.lpPoolAddress
              }
            : {}),
          // Create scheduled burns if provided
          scheduledBurns:
            data.burnType === 'CONTROLLED' && data.scheduledBurns
              ? {
                  create: data.scheduledBurns.map(burn => ({
                    scheduledFor: new Date(burn.scheduledFor),
                    amount: burn.amount,
                    status: BurnStatus.PENDING
                  }))
                }
              : undefined
        }
      })
    )

    // Get transaction gas cost
    const txInfo = await connection.getTransaction(data.signature, {
      maxSupportedTransactionVersion: 0
    })
    // Convert lamports to SOL (1 SOL = 1e9 lamports)
    const gasUsed = (txInfo?.meta?.fee || 0) / 1e9

    // For admin wallets, use gas cost as fee amount
    const effectiveFeeAmount = isAdminWallet ? gasUsed : feeAmount
    const effectiveNetProfit = isAdminWallet ? 0 : feeAmount - gasUsed

    // Create execution record with gas cost
    await executeWithRetry(() =>
      prisma.burnExecution.create({
        data: {
          transactionId: transaction.id,
          status: ExecutionStatus.STARTED,
          txSignature: data.signature,
          gasUsed: gasUsed.toString()
        }
      })
    )

    // Update transaction status to CONFIRMED and set confirmedAt
    await executeWithRetry(() =>
      prisma.burnTransaction.update({
        where: { id: transaction.id },
        data: {
          status: BurnStatus.CONFIRMED,
          confirmedAt: new Date()
        }
      })
    )

    // Update execution status to COMPLETED
    await executeWithRetry(() =>
      prisma.burnExecution.updateMany({
        where: {
          transactionId: transaction.id,
          txSignature: data.signature
        },
        data: {
          status: ExecutionStatus.COMPLETED,
          completedAt: new Date()
        }
      })
    )

    // Update global statistics with proper gas costs
    await executeWithRetry(() =>
      prisma.globalStatistic.upsert({
        where: { id: '1' },
        create: {
          id: '1',
          totalGasCosts: gasUsed.toString(),
          totalFeesCollected: effectiveFeeAmount.toString(),
          netProfit: effectiveNetProfit.toString()
        },
        update: {
          totalGasCosts: {
            increment: gasUsed
          },
          totalFeesCollected: {
            increment: effectiveFeeAmount
          },
          netProfit: {
            increment: effectiveNetProfit
          }
        }
      })
    )

    // Update burn statistics with retry mechanism - only update fees if not admin wallet
    await executeWithRetry(() =>
      prisma.burnStatistic.upsert({
        where: { tokenMint: data.tokenMint },
        update: {
          totalTransactions: { increment: 1 },
          [data.burnType === 'INSTANT' ? 'instantBurns' : 'controlledBurns']: { increment: 1 },
          totalFeesCollected: { increment: effectiveFeeAmount }
        },
        create: {
          tokenMint: data.tokenMint,
          tokenSymbol: data.tokenSymbol,
          totalBurned: '0',
          totalTransactions: 1,
          instantBurns: data.burnType === 'INSTANT' ? 1 : 0,
          controlledBurns: data.burnType === 'CONTROLLED' ? 1 : 0,
          totalFeesCollected: effectiveFeeAmount.toString()
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        burnWalletAddress: burnWallet.walletAddress
      }
    })
  } catch (error) {
    console.error('Error creating burn transaction:', error)
    return NextResponse.json({ success: false, error: 'Failed to create burn transaction' }, { status: 500 })
  }
}
