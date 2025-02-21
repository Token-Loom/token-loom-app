import { Connection } from '@solana/web3.js'
import { prisma } from '@/lib/prisma'
import { BurnStatus, ExecutionStatus, ScheduledBurn, BurnTransaction, NotificationType } from '@prisma/client'
import { burnTokens } from '@/lib/solana/burn'
import { decryptBurnWallet } from '@/lib/solana/wallet'

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set')
}

export class BurnScheduler {
  private connection: Connection
  private isRunning: boolean
  private maxWorkers: number
  private maxRetries: number
  private retryDelay: number

  constructor(connection: Connection, maxWorkers = 10, maxRetries = 3, retryDelay = 300) {
    this.connection = connection
    this.isRunning = false
    this.maxWorkers = maxWorkers
    this.maxRetries = maxRetries
    this.retryDelay = retryDelay
  }

  async start() {
    if (this.isRunning) return
    this.isRunning = true
    await this.processPendingBurns()
  }

  async stop() {
    this.isRunning = false
  }

  private async processPendingBurns() {
    while (this.isRunning) {
      try {
        // Get system configuration
        const config = await prisma.systemConfig.findFirst({
          where: { id: '1' }
        })

        if (!config?.isRunning) {
          this.isRunning = false
          return
        }

        // Update local settings
        this.maxWorkers = config.maxWorkers
        this.maxRetries = config.maxRetries
        this.retryDelay = config.retryDelay

        // Get active workers count
        const activeWorkers = await prisma.burnExecution.count({
          where: {
            startedAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
            },
            completedAt: null
          }
        })

        if (activeWorkers >= this.maxWorkers) {
          await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
          continue
        }

        // Get pending burns
        const pendingBurns = await prisma.scheduledBurn.findMany({
          where: {
            status: BurnStatus.PENDING,
            scheduledFor: {
              lte: new Date()
            },
            OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: new Date() } }],
            retryCount: { lt: this.maxRetries }
          },
          include: {
            transaction: {
              include: {
                burnWallet: true
              }
            }
          },
          take: this.maxWorkers - activeWorkers
        })

        // Process each pending burn
        await Promise.all(pendingBurns.map(burn => this.executeBurn(burn)))

        // Wait before next iteration
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Error processing pending burns:', error)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  private async executeBurn(
    burn: ScheduledBurn & {
      transaction: BurnTransaction & {
        burnWallet: {
          privateKey: string
        }
      }
    }
  ) {
    const execution = await prisma.burnExecution.create({
      data: {
        transactionId: burn.transactionId,
        scheduledBurnId: burn.id,
        status: ExecutionStatus.STARTED
      }
    })

    try {
      // Update burn status
      await prisma.scheduledBurn.update({
        where: { id: burn.id },
        data: { status: BurnStatus.PROCESSING }
      })

      // Decrypt burn wallet
      const burnWallet = await decryptBurnWallet(burn.transaction.burnWallet.privateKey, ENCRYPTION_KEY)

      // Execute burn
      const signature = await burnTokens({
        connection: this.connection,
        tokenMint: burn.transaction.tokenMint,
        amount: burn.amount.toString(),
        wallet: burnWallet.publicKey,
        signTransaction: async tx => {
          tx.sign(burnWallet)
          return tx
        },
        onProgress: status => console.log(`Burn progress: ${status}`)
      })

      if (!signature) {
        throw new Error('Failed to get transaction signature')
      }

      // Get transaction gas cost
      const txInfo = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0
      })
      const gasUsed = txInfo?.meta?.fee || 0

      // Update execution record
      await prisma.burnExecution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.COMPLETED,
          txSignature: signature,
          completedAt: new Date(),
          gasUsed: gasUsed
        }
      })

      // Update burn status
      await prisma.scheduledBurn.update({
        where: { id: burn.id },
        data: {
          status: BurnStatus.CONFIRMED,
          executedAt: new Date()
        }
      })

      // Create notification
      await prisma.notification.create({
        data: {
          userId: burn.transaction.userWallet || '',
          transactionId: burn.transactionId,
          type: NotificationType.BURN_COMPLETED,
          message: `Successfully burned ${burn.amount} ${burn.transaction.tokenSymbol} tokens`
        }
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Error executing burn ${burn.id}:`, error)

      // Update execution record
      await prisma.burnExecution.update({
        where: { id: execution.id },
        data: {
          status: ExecutionStatus.FAILED,
          errorMessage,
          completedAt: new Date()
        }
      })

      // Schedule retry if under max retries
      if (burn.retryCount < this.maxRetries) {
        await prisma.scheduledBurn.update({
          where: { id: burn.id },
          data: {
            status: BurnStatus.RETRYING,
            retryCount: { increment: 1 },
            nextRetryAt: new Date(Date.now() + this.retryDelay * 1000),
            errorMessage
          }
        })
      } else {
        await prisma.scheduledBurn.update({
          where: { id: burn.id },
          data: {
            status: BurnStatus.FAILED,
            errorMessage
          }
        })
      }

      // Create notification
      await prisma.notification.create({
        data: {
          userId: burn.transaction.userWallet || '',
          transactionId: burn.transactionId,
          type: NotificationType.BURN_FAILED,
          message: `Failed to burn ${burn.amount} ${burn.transaction.tokenSymbol} tokens: ${errorMessage}`
        }
      })
    }
  }

  private async createNotification(userId: string, transactionId: string, type: NotificationType, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        transactionId,
        type,
        message
      }
    })
  }
}
