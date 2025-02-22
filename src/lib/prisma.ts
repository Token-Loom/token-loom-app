import { PrismaClient, Prisma } from '@prisma/client'

// Add prisma to the NodeJS global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Maximum number of retries for database operations
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export async function executeWithRetry<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
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

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Configure connection for production
  if (process.env.NODE_ENV === 'production') {
    client.$connect().catch(err => {
      console.error('Failed to connect to database:', err)
      process.exit(1)
    })
  }

  return client
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Handle cleanup on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
