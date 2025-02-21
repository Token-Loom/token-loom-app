import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BurnType, BurnStatus } from '@prisma/client'
import { generateBurnWallet } from '@/lib/solana/wallet'

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
  amount: z.string(),
  burnType: z.enum(['INSTANT', 'CONTROLLED']),
  message: z.string().optional(),
  userWallet: z.string(),
  scheduledBurns: z.array(scheduledBurnSchema).optional()
})

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('Invalid or missing WALLET_ENCRYPTION_KEY environment variable')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = burnRequestSchema.parse(body)

    // Calculate fee based on burn type
    const feeAmount = data.burnType === 'INSTANT' ? 0.1 : 0.2

    // Generate new burn wallet with encryption
    const { walletAddress, encryptedPrivateKey } = await generateBurnWallet(ENCRYPTION_KEY as string)

    // Create burn wallet
    const burnWallet = await prisma.burnWallet.create({
      data: {
        walletAddress,
        privateKey: encryptedPrivateKey,
        isActive: true
      }
    })

    // Create the burn transaction
    const transaction = await prisma.burnTransaction.create({
      data: {
        tokenMint: data.tokenMint,
        tokenName: data.tokenName,
        tokenSymbol: data.tokenSymbol,
        amount: data.amount,
        burnType: data.burnType as BurnType,
        feeAmount,
        burnMessage: data.message,
        status: BurnStatus.PENDING,
        userWallet: data.userWallet,
        burnWalletId: burnWallet.id,
        txSignature: 'PENDING', // Replace with actual transaction signature
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

    // Update burn statistics
    await prisma.burnStatistic.upsert({
      where: { tokenMint: data.tokenMint },
      update: {
        totalTransactions: { increment: 1 },
        [data.burnType === 'INSTANT' ? 'instantBurns' : 'controlledBurns']: { increment: 1 },
        totalFeesCollected: { increment: feeAmount }
      },
      create: {
        tokenMint: data.tokenMint,
        tokenSymbol: data.tokenSymbol,
        totalBurned: '0',
        totalTransactions: 1,
        instantBurns: data.burnType === 'INSTANT' ? 1 : 0,
        controlledBurns: data.burnType === 'CONTROLLED' ? 1 : 0,
        totalFeesCollected: feeAmount.toString()
      }
    })

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
