'use client'

import { BurnForm } from '@/components/burn/burn-form'
import { StatusDashboard } from '@/components/burn/status-dashboard'
import { TransactionHistory } from '@/components/burn/transaction-history'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

export default function BurnPage() {
  const [activeTab, setActiveTab] = useState('burn')

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
          <div className='flex flex-col gap-4 mx-2 sm:gap-6 mb-8 sm:mb-12'>
            <div className='inline-flex items-center space-x-2 text-sm text-[#E6E6E6]/60'>
              <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                />
              </svg>
              <span>/</span>
              <span>Burn Dashboard</span>
            </div>
            <div>
              <h1 className='text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent mb-4'>
                Token Burn Dashboard
              </h1>
              <p className='text-[#E6E6E6]/80 text-lg sm:text-xl max-w-3xl'>
                Configure and execute token burns with real-time status updates. Track your burn history and monitor
                ongoing operations in one place.
              </p>
            </div>
          </div>

          <div className='bg-[#1A1B23]/50 backdrop-blur-sm border border-[#2E2E34] rounded-2xl p-2 sm:p-8'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6 sm:space-y-8'>
              <TabsList className='bg-[#1E1E24] border border-[#2E2E34] rounded-xl w-full flex justify-between sm:justify-start sm:w-auto sm:inline-flex p-1'>
                <TabsTrigger
                  value='burn'
                  className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-2 sm:px-6 py-2.5 text-sm sm:text-base transition-all'
                >
                  Burn Tokens
                </TabsTrigger>
                <TabsTrigger
                  value='status'
                  className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-2 sm:px-6 py-2.5 text-sm sm:text-base transition-all'
                >
                  Status
                </TabsTrigger>
                <TabsTrigger
                  value='history'
                  className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] data-[state=active]:text-white text-[#E6E6E6]/80 rounded-lg px-2 sm:px-6 py-2.5 text-sm sm:text-base transition-all'
                >
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value='burn' className='space-y-6 min-h-[500px]'>
                <BurnForm />
              </TabsContent>

              <TabsContent value='status' className='space-y-6 min-h-[500px]'>
                <StatusDashboard />
              </TabsContent>

              <TabsContent value='history' className='space-y-6 min-h-[500px]'>
                <TransactionHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  )
}
