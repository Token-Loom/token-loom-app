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

// Create a function to get a new Prisma client instance
function getNewPrismaClient() {
  // Configure database connection parameters
  const url = new URL(process.env.DATABASE_URL as string)
  url.searchParams.append('statement_cache_size', '0')
  url.searchParams.append('pgbouncer', 'true')
  url.searchParams.append('connection_limit', '1')

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: url.toString()
      }
    }
  })
}

// Export the default client for general use
export const prisma = getNewPrismaClient()

export async function executeWithRetry<T>(operation: (client: PrismaClient) => Promise<T>, retryCount = 0): Promise<T> {
  const client = getNewPrismaClient()

  try {
    const result = await operation(client)
    await client.$disconnect()
    return result
  } catch (error) {
    await client.$disconnect()

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

        // Retry the operation with a new client
        return executeWithRetry(operation, retryCount + 1)
      }
    }
    throw error
  }
}

// Handle cleanup on process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
