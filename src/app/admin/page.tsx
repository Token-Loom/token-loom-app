'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { BurnScheduleManager } from '@/components/admin/burn-schedule-manager'
import { ManualControls } from '@/components/admin/manual-controls'
import { MonitoringDashboard } from '@/components/admin/monitoring-dashboard'
import { ProfitDashboard } from '@/components/admin/profit-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isAdminWallet, getAdminWalletName } from '@/lib/solana/admin-config'

export default function AdminPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('monitoring')

  useEffect(() => {
    // Redirect if not an admin
    if (publicKey && !isAdminWallet(publicKey)) {
      router.push('/')
    }
  }, [publicKey, router])

  if (!publicKey || !isAdminWallet(publicKey)) {
    return null
  }

  return (
    <div className='container py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <p className='text-muted-foreground'>
          {publicKey && getAdminWalletName(publicKey.toString())} - {publicKey?.toString()}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='monitoring'>Monitoring</TabsTrigger>
          <TabsTrigger value='schedule'>Burn Schedule</TabsTrigger>
          <TabsTrigger value='controls'>Manual Controls</TabsTrigger>
          <TabsTrigger value='profit'>Profit</TabsTrigger>
        </TabsList>

        <TabsContent value='monitoring'>
          <MonitoringDashboard />
        </TabsContent>

        <TabsContent value='schedule'>
          <BurnScheduleManager />
        </TabsContent>

        <TabsContent value='controls'>
          <ManualControls />
        </TabsContent>

        <TabsContent value='profit'>
          <ProfitDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
