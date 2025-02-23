'use client'

import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface Transaction {
  id: string
  tokenMint: string
  tokenSymbol: string
  amount: string
  status: string
  burnType: 'INSTANT' | 'CONTROLLED'
  createdAt: string
  confirmedAt?: string
  txSignature?: string
  scheduledBurns: ScheduledBurn[]
  executions: Execution[]
  latestNotification?: {
    type: string
    message: string
    createdAt: string
  }
}

interface ScheduledBurn {
  id: string
  scheduledFor: string
  amount: string
  status: string
  executedAt?: string
  retryCount: number
  nextRetryAt?: string
  errorMessage?: string
  executions: Execution[]
}

interface Execution {
  id: string
  status: string
  txSignature?: string
  startedAt: string
  completedAt?: string
  errorMessage?: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function StatusDashboard() {
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [, setPagination] = useState<PaginationInfo>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!publicKey) {
      setTransactions([])
      setIsLoading(false)
      return
    }

    try {
      setError(null)

      const response = await fetch(`/api/burns/status?walletAddress=${publicKey.toString()}&page=1&limit=10`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch transactions')
      }

      setTransactions(result.data.transactions || [])
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    fetchTransactions()
    const interval = setInterval(fetchTransactions, 5000)
    return () => clearInterval(interval)
  }, [fetchTransactions])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant='outline' className='bg-yellow-500/10 text-yellow-500'>
            Pending
          </Badge>
        )
      case 'PROCESSING':
        return (
          <Badge variant='outline' className='bg-blue-500/10 text-blue-500'>
            Processing
          </Badge>
        )
      case 'CONFIRMED':
        return (
          <Badge variant='outline' className='bg-green-500/10 text-green-500'>
            Confirmed
          </Badge>
        )
      case 'FAILED':
        return (
          <Badge variant='outline' className='bg-red-500/10 text-red-500'>
            Failed
          </Badge>
        )
      case 'RETRYING':
        return (
          <Badge variant='outline' className='bg-purple-500/10 text-purple-500'>
            Retrying
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  if (!publicKey) {
    return (
      <Card className='overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
        <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
        <CardHeader className='relative'>
          <CardTitle className='text-2xl'>Connect Wallet</CardTitle>
          <CardDescription className='text-[#A3A3A3]'>Please connect your wallet to view burn status</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='overflow-hidden border-[#1E1E24] bg-black/20 backdrop-blur'>
      <div className='absolute inset-0 bg-gradient-to-r from-[#9945FF]/5 to-[#14F195]/5 opacity-50' />
      <CardHeader className='relative p-4 sm:p-6'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='space-y-1'>
            <CardTitle className='text-xl sm:text-2xl'>Burn Status</CardTitle>
            <CardDescription className='text-[#A3A3A3] text-sm sm:text-base'>
              View and monitor your burn transactions
            </CardDescription>
          </div>
          <Badge
            variant='outline'
            className={cn(
              'px-3 sm:px-4 py-1.5 sm:py-2 text-sm whitespace-nowrap',
              isLoading ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
            )}
          >
            {isLoading ? 'Updating...' : 'Updated'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='relative p-4 sm:p-6'>
        {error && (
          <Alert variant='destructive' className='mb-6'>
            <AlertCircle className='h-4 w-4 flex-shrink-0' />
            <div className='flex-1 space-y-1'>
              <AlertTitle className='text-base'>Error</AlertTitle>
              <AlertDescription className='break-words text-sm'>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        {isLoading && !transactions?.length ? (
          <Skeleton className='h-20 w-full bg-[#1E1E24]' />
        ) : !transactions?.length ? (
          <div className='text-center py-10 text-[#A3A3A3] text-sm sm:text-base'>No burn transactions found</div>
        ) : (
          <ScrollArea className='h-[450px] sm:h-[600px] pr-2 sm:pr-4 -mx-4 sm:mx-0'>
            <div className='space-y-4 px-4 sm:px-0'>
              {transactions?.map(tx => (
                <Card key={tx.id} className='border-[#1E1E24] bg-black/20'>
                  <CardHeader className='p-4 sm:p-6'>
                    <div className='flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4'>
                      <div className='space-y-1.5'>
                        <CardTitle className='text-base sm:text-lg break-all'>
                          {tx.amount} {tx.tokenSymbol}
                        </CardTitle>
                        <CardDescription className='text-sm'>
                          Created {format(new Date(tx.createdAt), 'PPp')}
                        </CardDescription>
                      </div>
                      <div className='self-start sm:self-center'>{getStatusBadge(tx.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-4 sm:p-6 pt-0 sm:pt-0'>
                    <Tabs defaultValue='details' className='w-full'>
                      <TabsList className='bg-[#1E1E24] w-full sm:w-auto mb-4'>
                        <TabsTrigger value='details' className='flex-1 sm:flex-none text-sm py-2'>
                          Details
                        </TabsTrigger>
                        <TabsTrigger value='schedule' className='flex-1 sm:flex-none text-sm py-2'>
                          Schedule
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value='details'>
                        <div className='space-y-3'>
                          <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                            <span className='text-[#A3A3A3] text-sm'>Status</span>
                            <span>{getStatusBadge(tx.status)}</span>
                          </div>
                          {tx.txSignature && (
                            <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                              <span className='text-[#A3A3A3] text-sm'>Transaction</span>
                              <a
                                href={`https://solscan.io/tx/${tx.txSignature}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-[#9945FF] hover:underline text-sm break-all'
                              >
                                View on Solscan
                              </a>
                            </div>
                          )}
                          {tx.confirmedAt && (
                            <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                              <span className='text-[#A3A3A3] text-sm'>Confirmed</span>
                              <span className='text-sm'>{format(new Date(tx.confirmedAt), 'PPp')}</span>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value='schedule'>
                        {!tx.scheduledBurns?.length ? (
                          <div className='text-center py-6 text-[#A3A3A3] text-sm'>No scheduled burns</div>
                        ) : (
                          <div className='space-y-6'>
                            {tx.scheduledBurns?.map(burn => (
                              <div
                                key={burn.id}
                                className='space-y-3 pb-4 border-b border-[#2E2E34] last:border-0 last:pb-0'
                              >
                                <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                                  <span className='text-[#A3A3A3] text-sm'>Amount</span>
                                  <span className='text-sm break-all'>
                                    {burn.amount} {tx.tokenSymbol}
                                  </span>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                                  <span className='text-[#A3A3A3] text-sm'>Scheduled For</span>
                                  <span className='text-sm'>{format(new Date(burn.scheduledFor), 'PPp')}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                                  <span className='text-[#A3A3A3] text-sm'>Status</span>
                                  <span>{getStatusBadge(burn.status)}</span>
                                </div>
                                {burn.executedAt && (
                                  <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                                    <span className='text-[#A3A3A3] text-sm'>Executed</span>
                                    <span className='text-sm'>{format(new Date(burn.executedAt), 'PPp')}</span>
                                  </div>
                                )}
                                {burn.errorMessage && (
                                  <div className='flex flex-col sm:flex-row justify-between gap-2 sm:gap-4'>
                                    <span className='text-[#A3A3A3] text-sm'>Error</span>
                                    <span className='text-red-500 text-sm break-words'>{burn.errorMessage}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
