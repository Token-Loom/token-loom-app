'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ExecutionStatus } from '@prisma/client'
import { formatTokenAmount } from '@/lib/utils'

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
    }
  }

  return (
    <div className='space-y-8'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-[#1E1E24] border-[#2E2E34]'>
          <CardHeader>
            <CardTitle className='text-[#E6E6E6]'>System Status</CardTitle>
            <CardDescription>Current system state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <div className={`h-3 w-3 rounded-full ${systemStatus.isRunning ? 'bg-[#14F195]' : 'bg-[#FF8F00]'}`} />
              <div className='text-2xl font-bold text-[#E6E6E6]'>{systemStatus.isRunning ? 'Running' : 'Paused'}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-[#1E1E24] border-[#2E2E34]'>
          <CardHeader>
            <CardTitle className='text-[#E6E6E6]'>Active Workers</CardTitle>
            <CardDescription>Currently running burn workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#14F195]'>{systemStatus.activeWorkers}</div>
          </CardContent>
        </Card>

        <Card className='bg-[#1E1E24] border-[#2E2E34]'>
          <CardHeader>
            <CardTitle className='text-[#E6E6E6]'>Pending Transactions</CardTitle>
            <CardDescription>Transactions waiting to be processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#00C2FF]'>{systemStatus.pendingTransactions}</div>
          </CardContent>
        </Card>

        <Card className='bg-[#1E1E24] border-[#2E2E34]'>
          <CardHeader>
            <CardTitle className='text-[#E6E6E6]'>Failed Transactions</CardTitle>
            <CardDescription>Transactions that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-[#FF8F00]'>{systemStatus.failedTransactions}</div>
          </CardContent>
        </Card>
      </div>

      <Card className='bg-[#1E1E24] border-[#2E2E34]'>
        <CardHeader>
          <CardTitle className='text-[#E6E6E6]'>Recent Executions</CardTitle>
          <CardDescription>Latest burn execution attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={executionColumns} data={executions} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  )
}
