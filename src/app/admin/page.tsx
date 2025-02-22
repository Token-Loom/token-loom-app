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

// List of admin wallet addresses
const ADMIN_WALLETS: string[] = [
  process.env.NEXT_PUBLIC_PAYMENT_WALLET || ''
  // Add admin wallet addresses here
]

export default function AdminPage() {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('monitoring')

  useEffect(() => {
    // Redirect if not an admin
    if (publicKey && !ADMIN_WALLETS.includes(publicKey.toBase58())) {
      router.push('/')
    }
  }, [publicKey, router])

  if (!publicKey || !ADMIN_WALLETS.includes(publicKey.toBase58())) {
    return null
  }

  return (
    <main className='min-h-screen bg-[#13141F] flex flex-col'>
      <section className='relative flex-1 py-8 sm:py-16'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />

        {/* Content */}
        <div className='container relative px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent'>
              Admin Dashboard
            </h1>
            <p className='text-[#E6E6E6]/80 text-base sm:text-lg'>
              Monitor system status, manage burn schedules, and control operations.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4 sm:space-y-6'>
            <div className='relative z-10'>
              <TabsList className='bg-transparent w-full sm:w-auto grid grid-cols-2 gap-2 sm:inline-flex sm:bg-[#1E1E24] sm:border sm:border-[#2E2E34] sm:gap-0'>
                <TabsTrigger
                  value='monitoring'
                  className='bg-[#1E1E24] py-2 border border-[#2E2E34] sm:border-0 rounded-md sm:rounded-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base px-4 h-12 sm:h-10'
                >
                  System Status
                </TabsTrigger>
                <TabsTrigger
                  value='profit'
                  className='bg-[#1E1E24] border border-[#2E2E34] sm:border-0 rounded-md sm:rounded-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base px-4 h-12 sm:h-10'
                >
                  Profit
                </TabsTrigger>
                <TabsTrigger
                  value='schedules'
                  className='bg-[#1E1E24] border border-[#2E2E34] sm:border-0 rounded-md sm:rounded-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base px-4 h-12 sm:h-10'
                >
                  Burn Schedules
                </TabsTrigger>
                <TabsTrigger
                  value='controls'
                  className='bg-[#1E1E24] border border-[#2E2E34] sm:border-0 rounded-md sm:rounded-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base px-4 h-12 sm:h-10'
                >
                  System Controls
                </TabsTrigger>
              </TabsList>
            </div>

            <div className='relative z-0 pt-16 sm:pt-0'>
              <TabsContent value='monitoring' className='space-y-4 min-h-[400px]'>
                <MonitoringDashboard />
              </TabsContent>

              <TabsContent value='profit' className='space-y-4 min-h-[400px]'>
                <ProfitDashboard />
              </TabsContent>

              <TabsContent value='schedules' className='space-y-4 min-h-[400px]'>
                <BurnScheduleManager />
              </TabsContent>

              <TabsContent value='controls' className='space-y-4 min-h-[400px]'>
                <ManualControls />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
