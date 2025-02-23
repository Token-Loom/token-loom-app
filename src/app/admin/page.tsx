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
import { BarChart3, Calendar, Settings, DollarSign } from 'lucide-react'

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
      <section className='relative flex-1 py-12 sm:py-20'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#14F195]/5 via-transparent to-transparent transform rotate-45' />
          <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00C2FF]/5 via-transparent to-transparent transform -rotate-45' />
        </div>

        {/* Content */}
        <div className='container relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
          <div className='flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12'>
            <div className='inline-flex items-center space-x-2 text-sm text-[#E6E6E6]/60'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
              <span>/</span>
              <span>Admin Dashboard</span>
            </div>
            <div>
              <h1 className='text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
                Admin Control Center
              </h1>
              <div className='space-y-2'>
                <p className='text-[#E6E6E6]/80 text-lg sm:text-xl max-w-3xl'>
                  Manage burn operations, monitor system status, and control platform settings.
                </p>
                <p className='text-[#E6E6E6]/60 text-sm sm:text-base font-mono'>
                  {publicKey && getAdminWalletName(publicKey.toString())}: {publicKey?.toString()}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-4 sm:p-6'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col gap-6'>
              <div className='bg-[#1E1E24] border border-[#2E2E34] rounded-xl'>
                <TabsList className='w-full h-fit grid grid-cols-2 sm:grid-cols-4 p-1'>
                  <TabsTrigger
                    value='monitoring'
                    className='bg-transparent hover:bg-[#2E2E34]/50 data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 m-0.5 h-10'
                  >
                    <BarChart3 className='w-4 h-4 shrink-0' />
                    <span>Monitoring</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='schedule'
                    className='bg-transparent hover:bg-[#2E2E34]/50 data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 m-0.5 h-10'
                  >
                    <Calendar className='w-4 h-4 shrink-0' />
                    <span>Schedule</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='controls'
                    className='bg-transparent hover:bg-[#2E2E34]/50 data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 m-0.5 h-10'
                  >
                    <Settings className='w-4 h-4 shrink-0' />
                    <span>Controls</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value='profit'
                    className='bg-transparent hover:bg-[#2E2E34]/50 data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-3 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-2 m-0.5 h-10'
                  >
                    <DollarSign className='w-4 h-4 shrink-0' />
                    <span>Profit</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className='space-y-4'>
                <TabsContent value='monitoring' className='mt-0'>
                  <MonitoringDashboard />
                </TabsContent>

                <TabsContent value='schedule' className='mt-0'>
                  <BurnScheduleManager />
                </TabsContent>

                <TabsContent value='controls' className='mt-0'>
                  <ManualControls />
                </TabsContent>

                <TabsContent value='profit' className='mt-0'>
                  <ProfitDashboard />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  )
}
