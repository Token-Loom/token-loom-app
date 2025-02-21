import { WebSocketServer } from 'ws'
import WebSocket from 'ws'
import { Server as HttpServer, IncomingMessage } from 'http'
import { BurnTransaction, ScheduledBurn, BurnExecution, Notification } from '@prisma/client'

interface BurnUpdateData {
  id: string
  status?: string
  txSignature?: string | null
  confirmedAt?: Date | null
  executedAt?: Date | null
  retryCount?: number
  nextRetryAt?: Date | null
  errorMessage?: string | null
  startedAt?: Date
  completedAt?: Date | null
  type?: string
  message?: string
  createdAt?: Date
}

interface BurnUpdate {
  type: 'BURN_UPDATE' | 'SCHEDULE_UPDATE' | 'EXECUTION_UPDATE' | 'NOTIFICATION'
  data: BurnUpdateData
}

export class BurnUpdateServer {
  private wss: WebSocketServer
  private clients: Map<string, WebSocket> = new Map()

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server })
    this.setupWebSocket()
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      // Extract wallet address from query params
      const url = new URL(req.url || '', `http://${req.headers.host}`)
      const walletAddress = url.searchParams.get('walletAddress')

      if (!walletAddress) {
        ws.close(1008, 'Wallet address required')
        return
      }

      // Store client connection
      this.clients.set(walletAddress, ws)

      ws.on('close', () => {
        this.clients.delete(walletAddress)
      })

      // Send initial connection confirmation
      ws.send(JSON.stringify({ type: 'CONNECTED', data: { walletAddress } }))
    })
  }

  // Send burn transaction updates
  sendBurnUpdate(walletAddress: string, transaction: BurnTransaction) {
    const client = this.clients.get(walletAddress)
    if (client) {
      const update: BurnUpdate = {
        type: 'BURN_UPDATE',
        data: {
          id: transaction.id,
          status: transaction.status,
          txSignature: transaction.txSignature,
          confirmedAt: transaction.confirmedAt
        }
      }
      client.send(JSON.stringify(update))
    }
  }

  // Send scheduled burn updates
  sendScheduleUpdate(walletAddress: string, schedule: ScheduledBurn) {
    const client = this.clients.get(walletAddress)
    if (client) {
      const update: BurnUpdate = {
        type: 'SCHEDULE_UPDATE',
        data: {
          id: schedule.id,
          status: schedule.status,
          executedAt: schedule.executedAt,
          retryCount: schedule.retryCount,
          nextRetryAt: schedule.nextRetryAt,
          errorMessage: schedule.errorMessage
        }
      }
      client.send(JSON.stringify(update))
    }
  }

  // Send execution updates
  sendExecutionUpdate(walletAddress: string, execution: BurnExecution) {
    const client = this.clients.get(walletAddress)
    if (client) {
      const update: BurnUpdate = {
        type: 'EXECUTION_UPDATE',
        data: {
          id: execution.id,
          status: execution.status,
          txSignature: execution.txSignature,
          startedAt: execution.startedAt,
          completedAt: execution.completedAt,
          errorMessage: execution.errorMessage
        }
      }
      client.send(JSON.stringify(update))
    }
  }

  // Send notifications
  sendNotification(walletAddress: string, notification: Notification) {
    const client = this.clients.get(walletAddress)
    if (client) {
      const update: BurnUpdate = {
        type: 'NOTIFICATION',
        data: {
          id: notification.id,
          status: 'NOTIFICATION',
          type: notification.type,
          message: notification.message,
          createdAt: notification.createdAt
        }
      }
      client.send(JSON.stringify(update))
    }
  }

  // Broadcast to all connected clients
  broadcast(update: BurnUpdate) {
    this.clients.forEach(client => {
      client.send(JSON.stringify(update))
    })
  }
}
