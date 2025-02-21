'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Play, Pause, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface SystemStatus {
  isRunning: boolean
  lastSyncTime?: Date
}

export function ManualControls() {
  const [status, setStatus] = useState<SystemStatus>({ isRunning: true })
  const [isLoading, setIsLoading] = useState(false)
  const [maxRetries, setMaxRetries] = useState('3')
  const [retryDelay, setRetryDelay] = useState('300')
  const [isStatusLoading, setIsStatusLoading] = useState(false)
  const [isConfigLoading, setIsConfigLoading] = useState(true)

  useEffect(() => {
    fetchSystemStatus()
    fetchConfig()
    const interval = setInterval(fetchSystemStatus, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/system/config')
      if (response.ok) {
        const data = await response.json()
        setMaxRetries(data.maxRetries.toString())
        setRetryDelay(data.retryDelay.toString())
      }
    } catch (error) {
      console.error('Error fetching config:', error)
      toast.error('Failed to fetch system configuration')
    } finally {
      setIsConfigLoading(false)
    }
  }

  const fetchSystemStatus = async () => {
    setIsStatusLoading(true)
    try {
      const response = await fetch('/api/admin/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(prev => ({ ...prev, isRunning: data.isRunning }))
      }
    } catch (error) {
      console.error('Error fetching system status:', error)
    } finally {
      setIsStatusLoading(false)
    }
  }

  const handleToggleSystem = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/system/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status.isRunning ? 'pause' : 'resume' })
      })

      const data = await response.json()

      if (response.ok) {
        setStatus(prev => ({ ...prev, isRunning: data.isRunning }))
        toast.success(`System ${data.isRunning ? 'resumed' : 'paused'} successfully`)
      } else {
        console.error('Toggle request failed:', data.error)
        toast.error(data.error || 'Failed to toggle system')
      }
    } catch (error) {
      console.error('Error toggling system:', error)
      toast.error('Failed to toggle system status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/system/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxRetries: parseInt(maxRetries),
          retryDelay: parseInt(retryDelay)
        })
      })

      if (response.ok) {
        toast.success('System configuration updated')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update configuration')
      }
    } catch (error) {
      console.error('Error updating config:', error)
      toast.error('Failed to update system configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncNow = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/system/sync', {
        method: 'POST'
      })

      if (response.ok) {
        setStatus(prev => ({ ...prev, lastSyncTime: new Date() }))
        toast.success('Manual sync initiated')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to initiate sync')
      }
    } catch (error) {
      console.error('Error initiating sync:', error)
      toast.error('Failed to initiate manual sync')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>System Control</CardTitle>
          <CardDescription>Control the burn execution system</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            <Button
              variant={status.isRunning ? 'destructive' : 'default'}
              onClick={handleToggleSystem}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : status.isRunning ? (
                <Pause className='mr-2 h-4 w-4' />
              ) : (
                <Play className='mr-2 h-4 w-4' />
              )}
              {status.isRunning ? 'Pause System' : 'Resume System'}
            </Button>

            <Button variant='outline' onClick={handleSyncNow} disabled={isLoading || !status.isRunning}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Sync Now
            </Button>

            {isStatusLoading && <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
          </div>

          {status.lastSyncTime && (
            <p className='text-sm text-muted-foreground'>Last sync: {status.lastSyncTime.toLocaleString()}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure system parameters</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {isConfigLoading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-[#9945FF]' />
            </div>
          ) : (
            <>
              <div className='space-y-2'>
                <Label htmlFor='maxRetries'>Maximum Retries</Label>
                <Input
                  id='maxRetries'
                  type='number'
                  value={maxRetries}
                  onChange={e => setMaxRetries(e.target.value)}
                  min='0'
                  max='10'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='retryDelay'>Retry Delay (seconds)</Label>
                <Input
                  id='retryDelay'
                  type='number'
                  value={retryDelay}
                  onChange={e => setRetryDelay(e.target.value)}
                  min='60'
                  max='3600'
                />
              </div>

              <Button onClick={handleUpdateConfig} disabled={isLoading} className='w-full'>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update Configuration'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
