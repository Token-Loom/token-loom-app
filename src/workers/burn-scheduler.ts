import { Connection } from '@solana/web3.js'
import { BurnScheduler } from '@/services/burn-scheduler'

// Get RPC endpoint from environment variable or use default
const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com'

// Create Solana connection
const connection = new Connection(rpcEndpoint)

// Create and start the burn scheduler
const scheduler = new BurnScheduler(connection)

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal')
  scheduler.stop()
})

process.on('SIGINT', () => {
  console.log('Received SIGINT signal')
  scheduler.stop()
})

// Start the scheduler
scheduler.start().catch(error => {
  console.error('Error starting burn scheduler:', error)
  process.exit(1)
})
