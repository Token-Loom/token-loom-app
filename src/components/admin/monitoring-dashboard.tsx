'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ExecutionStatus } from '@prisma/client'
import { formatTokenAmount } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface SystemStatus {
  activeWorkers: number
  pendingTransactions: number
  failedTransactions: number
  systemLoad: number
  isRunning: boolean
  lastUpdated: Date
}

interface BurnExecution {
  id: string
  startedAt: Date
  status: ExecutionStatus
  gasUsed?: number
  retryCount: number
  errorMessage?: string
}

const executionColumns: ColumnDef<BurnExecution>[] = [
  {
    accessorKey: 'startedAt',
    header: 'Started',
    cell: ({ row }) => formatDistanceToNow(new Date(row.original.startedAt), { addSuffix: true })
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const variant =
        row.original.status === 'COMPLETED'
          ? 'default'
          : row.original.status === 'STARTED'
            ? 'secondary'
            : 'destructive'
      return <Badge variant={variant}>{row.original.status.toLowerCase()}</Badge>
    }
  },
  {
    accessorKey: 'gasUsed',
    header: 'Gas Used',
    cell: ({ row }) => (row.original.gasUsed ? formatTokenAmount(row.original.gasUsed) : '-')
  },
  {
    accessorKey: 'retryCount',
    header: 'Retries'
  },
  {
    accessorKey: 'errorMessage',
    header: 'Error',
    cell: ({ row }) => row.original.errorMessage || '-'
  }
]

export function MonitoringDashboard() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    activeWorkers: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    systemLoad: 0,
    isRunning: true,
    lastUpdated: new Date()
  })
  const [executions, setExecutions] = useState<BurnExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [statusRes, executionsRes] = await Promise.all([fetch('/api/admin/status'), fetch('/api/admin/executions')])

      if (statusRes.ok) {
        const status = await statusRes.json()
        setSystemStatus(status)
      }

      if (executionsRes.ok) {
        const execs = await executionsRes.json()
        setExecutions(execs)
      }
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6 sm:space-y-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4'>
        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 p-4 sm:p-6'>
            <CardTitle className='text-base sm:text-lg text-[#E6E6E6] mb-1'>System Status</CardTitle>
            <CardDescription className='text-sm text-[#E6E6E6]/60'>Current system state</CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {loading ? (
              <div className='flex items-center gap-2 mt-3'>
                <Skeleton className='h-6 sm:h-8 w-20 sm:w-24 bg-[#1E1E24]' />
              </div>
            ) : (
              <div className='flex items-center gap-3 mt-3'>
                <div className={`h-3 w-3 rounded-full ${systemStatus.isRunning ? 'bg-[#14F195]' : 'bg-[#FF8F00]'}`} />
                <div className='text-lg sm:text-2xl font-bold text-[#E6E6E6]'>
                  {systemStatus.isRunning ? 'Running' : 'Paused'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 p-4 sm:p-6'>
            <CardTitle className='text-base sm:text-lg text-[#E6E6E6] mb-1'>Active Workers</CardTitle>
            <CardDescription className='text-sm text-[#E6E6E6]/60'>Currently running burn workers</CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {loading ? (
              <Skeleton className='h-6 sm:h-8 w-14 sm:w-16 bg-[#1E1E24] mt-3' />
            ) : (
              <div className='text-lg sm:text-2xl font-bold text-[#14F195] mt-3'>{systemStatus.activeWorkers}</div>
            )}
          </CardContent>
        </Card>

        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 p-4 sm:p-6'>
            <CardTitle className='text-base sm:text-lg text-[#E6E6E6] mb-1'>Pending Transactions</CardTitle>
            <CardDescription className='text-sm text-[#E6E6E6]/60'>
              Transactions waiting to be processed
            </CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {loading ? (
              <Skeleton className='h-6 sm:h-8 w-14 sm:w-16 bg-[#1E1E24] mt-3' />
            ) : (
              <div className='text-lg sm:text-2xl font-bold text-[#00C2FF] mt-3'>
                {systemStatus.pendingTransactions}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='bg-black/20 border-[#2E2E34]'>
          <CardHeader className='pb-2 p-4 sm:p-6'>
            <CardTitle className='text-base sm:text-lg text-[#E6E6E6] mb-1'>Failed Transactions</CardTitle>
            <CardDescription className='text-sm text-[#E6E6E6]/60'>Transactions that need attention</CardDescription>
          </CardHeader>
          <CardContent className='p-4 sm:p-6 pt-0'>
            {loading ? (
              <Skeleton className='h-6 sm:h-8 w-14 sm:w-16 bg-[#1E1E24] mt-3' />
            ) : (
              <div className='text-lg sm:text-2xl font-bold text-[#FF8F00] mt-3'>{systemStatus.failedTransactions}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className='bg-black/20 border-[#2E2E34]'>
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='text-base sm:text-lg text-[#E6E6E6] mb-1'>Recent Executions</CardTitle>
          <CardDescription className='text-sm text-[#E6E6E6]/60'>Latest burn execution attempts</CardDescription>
        </CardHeader>
        <CardContent className='p-0 sm:p-6 sm:pt-0 overflow-hidden'>
          {loading ? (
            <div className='space-y-3 p-4 sm:p-0'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className='h-5 sm:h-6 w-full bg-[#1E1E24]' />
                </div>
              ))}
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <div className='min-w-[600px] sm:w-full [&_th]:p-4 [&_td]:p-4 [&_th]:text-sm [&_td]:text-sm'>
                <DataTable columns={executionColumns} data={executions} pageSize={10} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
