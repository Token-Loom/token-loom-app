import { PrismaClient } from '@prisma/client'

// Add prisma to the NodeJS global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
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

  // Configure connection pool for production
  if (process.env.NODE_ENV === 'production') {
    client.$connect()
  }

  return client
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
