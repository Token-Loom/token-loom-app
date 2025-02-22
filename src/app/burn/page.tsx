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
      <section className='relative flex-1 py-8 sm:py-16'>
        {/* Background effects */}
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#9945FF]/10 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,_#9945FF08_1px,transparent_1px),linear-gradient(to_bottom,_#9945FF08_1px,transparent_1px)] bg-[size:24px_24px]' />

        {/* Content */}
        <div className='container relative px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8'>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#00C2FF] bg-clip-text text-transparent'>
              Burn Dashboard
            </h1>
            <p className='text-[#E6E6E6]/80 text-base sm:text-lg'>
              Configure and execute token burns with real-time status updates and transaction history.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4 sm:space-y-6'>
            <TabsList className='bg-[#1E1E24] border border-[#2E2E34] w-full flex justify-between sm:justify-start sm:w-auto sm:inline-flex'>
              <TabsTrigger
                value='burn'
                className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base'
              >
                Burn Tokens
              </TabsTrigger>
              <TabsTrigger
                value='status'
                className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base'
              >
                Status
              </TabsTrigger>
              <TabsTrigger
                value='history'
                className='flex-1 sm:flex-none data-[state=active]:bg-[#2E2E34] text-sm sm:text-base'
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value='burn' className='space-y-4 min-h-[400px]'>
              <BurnForm />
            </TabsContent>

            <TabsContent value='status' className='space-y-4 min-h-[400px]'>
              <StatusDashboard />
            </TabsContent>

            <TabsContent value='history' className='space-y-4 min-h-[400px]'>
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}
