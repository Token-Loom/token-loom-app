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
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
}

// Use global prisma instance in development to prevent too many connections
const prisma = global.prisma || getNewPrismaClient()
if (process.env.NODE_ENV === 'development') global.prisma = prisma

export { prisma }

export async function executeWithRetry<T>(operation: (client: PrismaClient) => Promise<T>, retryCount = 0): Promise<T> {
  try {
    const result = await operation(prisma)
    return result
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

        // Retry the operation
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
