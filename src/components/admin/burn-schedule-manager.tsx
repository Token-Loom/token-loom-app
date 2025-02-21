'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BurnStatus } from '@prisma/client'
import { formatTokenAmount } from '@/lib/utils'
import { Loader2, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ScheduledBurn {
  id: string
  transactionId: string
  scheduledFor: Date
  amount: number
  status: BurnStatus
  executedAt?: Date
  retryCount: number
  nextRetryAt?: Date
  errorMessage?: string
  transaction: {
    tokenSymbol: string
    tokenMint: string
  }
}

export function BurnScheduleManager() {
  const [schedules, setSchedules] = useState<ScheduledBurn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedules()
    const interval = setInterval(fetchSchedules, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSchedules = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/schedules')
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch schedules')
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      setError('Failed to fetch schedules')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/schedules/${id}/retry`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchSchedules()
      }
    } catch (error) {
      console.error('Error retrying schedule:', error)
    }
  }

  const handleTogglePause = async (id: string, isPaused: boolean) => {
    try {
      const response = await fetch(`/api/admin/schedules/${id}/${isPaused ? 'resume' : 'pause'}`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchSchedules()
      }
    } catch (error) {
      console.error('Error toggling schedule:', error)
    }
  }

  const columns: ColumnDef<ScheduledBurn>[] = [
    {
      accessorKey: 'scheduledFor',
      header: 'Scheduled For',
      cell: ({ row }) => formatDistanceToNow(new Date(row.original.scheduledFor), { addSuffix: true })
    },
    {
      accessorKey: 'transaction.tokenSymbol',
      header: 'Token'
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatTokenAmount(row.original.amount)
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const variant =
          row.original.status === BurnStatus.CONFIRMED
            ? 'default'
            : row.original.status === BurnStatus.PENDING
              ? 'secondary'
              : 'destructive'
        return <Badge variant={variant}>{row.original.status.toLowerCase()}</Badge>
      }
    },
    {
      accessorKey: 'retryCount',
      header: 'Retries'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const isPaused = row.original.status === BurnStatus.FAILED
        const canRetry = row.original.status === BurnStatus.FAILED
        const isProcessing = row.original.status === BurnStatus.PROCESSING

        return (
          <div className='flex items-center gap-2'>
            {canRetry && (
              <Button variant='ghost' size='icon' onClick={() => handleRetry(row.original.id)} disabled={isProcessing}>
                <RotateCcw className='h-4 w-4' />
              </Button>
            )}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleTogglePause(row.original.id, isPaused)}
              disabled={isProcessing || canRetry}
            >
              {isProcessing ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : isPaused ? (
                <Play className='h-4 w-4' />
              ) : (
                <Pause className='h-4 w-4' />
              )}
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Burn Schedules</CardTitle>
        <CardDescription>Manage scheduled token burns</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-[#9945FF]' />
          </div>
        ) : schedules.length === 0 ? (
          <div className='text-center py-8 text-[#A3A3A3]'>No scheduled burns found</div>
        ) : (
          <DataTable columns={columns} data={schedules} pageSize={10} />
        )}
      </CardContent>
    </Card>
  )
}
