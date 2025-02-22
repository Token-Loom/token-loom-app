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
    <main className='min-h-screen bg-[#13141F] flex flex-col'>
      <section className='relative flex-1 py-8 sm:py-16'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />

        {/* Content */}
        <div className='container relative'>
          <div className='flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent'>
              Admin Dashboard
            </h1>
            <p className='text-[#E6E6E6]/80 text-base sm:text-lg'>
              {publicKey && getAdminWalletName(publicKey.toString())}: {publicKey?.toString()}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <TabsList className='bg-[#1E1E24] border-[#2E2E34]'>
              <TabsTrigger
                value='monitoring'
                className='data-[state=active]:bg-[#2E2E34] data-[state=active]:text-[#E6E6E6]'
              >
                Monitoring
              </TabsTrigger>
              <TabsTrigger
                value='schedule'
                className='data-[state=active]:bg-[#2E2E34] data-[state=active]:text-[#E6E6E6]'
              >
                Burn Schedule
              </TabsTrigger>
              <TabsTrigger
                value='controls'
                className='data-[state=active]:bg-[#2E2E34] data-[state=active]:text-[#E6E6E6]'
              >
                Manual Controls
              </TabsTrigger>
              <TabsTrigger
                value='profit'
                className='data-[state=active]:bg-[#2E2E34] data-[state=active]:text-[#E6E6E6]'
              >
                Profit
              </TabsTrigger>
            </TabsList>

            <TabsContent value='monitoring' className='space-y-6'>
              <MonitoringDashboard />
            </TabsContent>

            <TabsContent value='schedule' className='space-y-6'>
              <BurnScheduleManager />
            </TabsContent>

            <TabsContent value='controls' className='space-y-6'>
              <ManualControls />
            </TabsContent>

            <TabsContent value='profit' className='space-y-6'>
              <ProfitDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
