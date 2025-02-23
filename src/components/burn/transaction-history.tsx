'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
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

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })
  },
  {
    accessorKey: 'tokenSymbol',
    header: 'Token',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span>{row.original.tokenSymbol}</span>
        <span className='text-xs text-muted-foreground'>{truncateAddress(row.original.tokenMint)}</span>
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: 'Amount'
  },
  {
    accessorKey: 'burnType',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant={row.original.burnType === 'INSTANT' ? 'default' : 'secondary'}>
        {row.original.burnType.toLowerCase()}
      </Badge>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const variant =
        row.original.status === 'CONFIRMED'
          ? 'default'
          : row.original.status === 'PENDING'
            ? 'secondary'
            : 'destructive'
      return <Badge variant={variant}>{row.original.status.toLowerCase()}</Badge>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Button
        variant='ghost'
        size='icon'
        onClick={() => window.open(`https://solscan.io/tx/${row.original.txSignature}`, '_blank')}
      >
        <ExternalLink className='h-4 w-4' />
      </Button>
    )
  }
]

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
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>View and filter your burn transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-4'>
            <>
              <div className='flex-1 min-w-[200px]'>
                <Input
                  placeholder='Search by token name or address'
                  value={tokenFilter}
                  onChange={e => setTokenFilter(e.target.value)}
                />
              </div>
              <DatePickerWithRange value={dateRange} onChange={setDateRange} />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ALL'>All</SelectItem>
                  <SelectItem value='PENDING'>Pending</SelectItem>
                  <SelectItem value='CONFIRMED'>Confirmed</SelectItem>
                  <SelectItem value='FAILED'>Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' onClick={handleExport} disabled={!transactions.length || isLoading}>
                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Download className='mr-2 h-4 w-4' />}
                Export
              </Button>
              <Button variant='outline' onClick={() => setIsPolling(!isPolling)}>
                {isPolling ? <Pause className='mr-2 h-4 w-4' /> : <RefreshCw className='mr-2 h-4 w-4' />}
                {isPolling ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
              </Button>
            </>
          </div>

          {isLoading ? (
            <Skeleton className='h-16 w-full bg-[#1E1E24]' />
          ) : (
            <DataTable columns={columns} data={transactions} pageSize={pagination.limit} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
