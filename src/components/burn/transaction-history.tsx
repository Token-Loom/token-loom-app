'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Download, Loader2, RefreshCw, Pause } from 'lucide-react'
import { truncateAddress } from '@/lib/utils'
import { BurnStatus, BurnType } from '@prisma/client'
import { DateRange } from 'react-day-picker'
import { Skeleton } from '@/components/ui/skeleton'

interface Transaction {
  id: string
  tokenMint: string
  tokenName: string
  tokenSymbol: string
  amount: number
  burnWallet: string
  txSignature: string
  status: BurnStatus
  burnType: BurnType
  feeAmount: number
  burnMessage?: string
  createdAt: Date
  confirmedAt?: Date
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function TransactionHistory() {
  const { publicKey } = useWallet()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [tokenFilter, setTokenFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isPolling, setIsPolling] = useState(true)

  const fetchTransactions = useCallback(async () => {
    if (!publicKey) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        wallet: publicKey.toBase58(),
        ...(tokenFilter && { token: tokenFilter }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(dateRange?.from && { startDate: dateRange.from.toISOString() }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString() }),
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()

      if (response.ok) {
        setTransactions(data.transactions)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch transactions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, tokenFilter, statusFilter, dateRange, pagination.page, pagination.limit])

  useEffect(() => {
    if (publicKey) {
      fetchTransactions()

      // Set up polling interval if polling is enabled
      let interval: NodeJS.Timeout | undefined
      if (isPolling) {
        interval = setInterval(fetchTransactions, 10000) // Poll every 10 seconds
      }

      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [publicKey, tokenFilter, statusFilter, dateRange, pagination.page, isPolling, fetchTransactions])

  const handleExport = () => {
    if (!transactions.length) return

    const csvContent = [
      ['Date', 'Token', 'Token Mint', 'Amount', 'Type', 'Status', 'Transaction'],
      ...transactions.map(tx => [
        new Date(tx.createdAt).toLocaleString(),
        tx.tokenSymbol,
        tx.tokenMint,
        tx.amount.toString(),
        tx.burnType.toLowerCase(),
        tx.status.toLowerCase(),
        tx.txSignature
      ])
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `burn-transactions-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card className='w-full'>
      <CardHeader className='p-4 sm:p-6'>
        <CardTitle className='text-xl sm:text-2xl'>Transaction History</CardTitle>
        <CardDescription className='text-sm sm:text-base'>View and filter your burn transactions</CardDescription>
      </CardHeader>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex flex-col gap-4 sm:gap-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4'>
            <div className='w-full sm:col-span-2 lg:flex-1 min-w-[200px]'>
              <Input
                placeholder='Search by token name or address'
                value={tokenFilter}
                onChange={e => setTokenFilter(e.target.value)}
                className='h-10'
              />
            </div>
            <div className='w-full sm:col-span-2 lg:w-auto'>
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full lg:w-[180px] h-10'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All</SelectItem>
                <SelectItem value='PENDING'>Pending</SelectItem>
                <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
                <SelectItem value='FAILED'>Failed</SelectItem>
              </SelectContent>
            </Select>
            <div className='flex flex-wrap gap-3 sm:gap-4'>
              <Button
                variant='outline'
                onClick={handleExport}
                disabled={!transactions.length || isLoading}
                className='w-full sm:w-auto h-10'
              >
                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Download className='mr-2 h-4 w-4' />}
                Export
              </Button>
              <Button variant='outline' onClick={() => setIsPolling(!isPolling)} className='w-full sm:w-auto h-10'>
                {isPolling ? <Pause className='mr-2 h-4 w-4' /> : <RefreshCw className='mr-2 h-4 w-4' />}
                {isPolling ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className='h-20 w-full bg-[#1E1E24]' />
          ) : (
            <>
              {/* Desktop view */}
              <div className='hidden sm:block rounded-md border border-[#2E2E34] overflow-hidden'>
                <div className='overflow-x-auto'>
                  <div className='min-w-[700px]'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b border-[#2E2E34] bg-[#1E1E24]'>
                          <th className='text-left p-3 text-sm font-medium text-[#E6E6E6]/60'>Date</th>
                          <th className='text-left p-3 text-sm font-medium text-[#E6E6E6]/60'>Token</th>
                          <th className='text-left p-3 text-sm font-medium text-[#E6E6E6]/60'>Amount</th>
                          <th className='text-left p-3 text-sm font-medium text-[#E6E6E6]/60'>Type</th>
                          <th className='text-left p-3 text-sm font-medium text-[#E6E6E6]/60'>Status</th>
                          <th className='text-right p-3 text-sm font-medium text-[#E6E6E6]/60'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(tx => (
                          <tr key={tx.id} className='border-b border-[#2E2E34] last:border-0'>
                            <td className='p-3 text-sm'>
                              {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                            </td>
                            <td className='p-3'>
                              <div className='flex flex-col'>
                                <span className='text-sm'>{tx.tokenSymbol}</span>
                                <span className='text-xs text-[#E6E6E6]/60'>{truncateAddress(tx.tokenMint)}</span>
                              </div>
                            </td>
                            <td className='p-3 text-sm'>{tx.amount}</td>
                            <td className='p-3'>
                              <Badge variant={tx.burnType === 'INSTANT' ? 'default' : 'secondary'}>
                                {tx.burnType.toLowerCase()}
                              </Badge>
                            </td>
                            <td className='p-3'>
                              <Badge
                                variant={
                                  tx.status === 'CONFIRMED'
                                    ? 'default'
                                    : tx.status === 'PENDING'
                                      ? 'secondary'
                                      : 'destructive'
                                }
                              >
                                {tx.status.toLowerCase()}
                              </Badge>
                            </td>
                            <td className='p-3 text-right'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => window.open(`https://solscan.io/tx/${tx.txSignature}`, '_blank')}
                                className='h-8 w-8'
                              >
                                <ExternalLink className='h-4 w-4' />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mobile view */}
              <div className='sm:hidden space-y-4'>
                {transactions.map(tx => (
                  <div key={tx.id} className='bg-[#1A1B23] border border-[#2E2E34] rounded-lg p-4 space-y-3'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-sm font-medium'>{tx.tokenSymbol}</span>
                          <Badge variant={tx.burnType === 'INSTANT' ? 'default' : 'secondary'}>
                            {tx.burnType.toLowerCase()}
                          </Badge>
                        </div>
                        <div className='text-xs text-[#E6E6E6]/60 truncate'>{tx.tokenMint}</div>
                      </div>
                      <Badge
                        variant={
                          tx.status === 'CONFIRMED' ? 'default' : tx.status === 'PENDING' ? 'secondary' : 'destructive'
                        }
                      >
                        {tx.status.toLowerCase()}
                      </Badge>
                    </div>

                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between items-center'>
                        <span className='text-[#E6E6E6]/60'>Amount</span>
                        <span>{tx.amount}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <span className='text-[#E6E6E6]/60'>Date</span>
                        <span>{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    <div className='pt-2 border-t border-[#2E2E34]'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => window.open(`https://solscan.io/tx/${tx.txSignature}`, '_blank')}
                        className='w-full text-[#9945FF] hover:text-[#9945FF] hover:bg-[#9945FF]/10'
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        View on Solscan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
